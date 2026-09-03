package schemagen

import (
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

var jsonTagNameRe = regexp.MustCompile(`json:"([^"]+)"`)

func parseDomainStructs(domainDir string) (map[string]*StructInfo, error) {
	fset := token.NewFileSet()
	pkgs, err := parser.ParseDir(fset, domainDir, func(info os.FileInfo) bool {
		return !strings.HasSuffix(info.Name(), "_test.go")
	}, parser.ParseComments)
	if err != nil {
		return nil, err
	}

	var pkg *ast.Package
	for _, p := range pkgs {
		pkg = p
		break
	}
	if pkg == nil {
		return nil, fmt.Errorf("no package in %s", domainDir)
	}

	out := make(map[string]*StructInfo)
	for _, f := range pkg.Files {
		ast.Inspect(f, func(n ast.Node) bool {
			ts, ok := n.(*ast.TypeSpec)
			if !ok || ts.Type == nil {
				return true
			}
			st, ok := ts.Type.(*ast.StructType)
			if !ok {
				return true
			}
			info := &StructInfo{Name: ts.Name.Name}
			for _, field := range st.Fields.List {
				if len(field.Names) == 0 {
					continue
				}
				goName := field.Names[0].Name
				if !ast.IsExported(goName) {
					continue
				}
				jsonName, omitempty := parseJSONTag(field.Tag)
				if jsonName == "" || jsonName == "-" {
					continue
				}
				info.Fields = append(info.Fields, StructField{
					JSONName:    jsonName,
					GoName:      goName,
					TypeExpr:    typeExpr(field.Type),
					Required:    !omitempty,
					Description: fieldComment(field),
				})
			}
			out[ts.Name.Name] = info
			return true
		})
	}
	return out, nil
}

func parseJSONTag(tag *ast.BasicLit) (name string, omitempty bool) {
	if tag == nil {
		return "", false
	}
	val := strings.Trim(tag.Value, "`")
	m := jsonTagNameRe.FindStringSubmatch(val)
	if len(m) < 2 {
		return "", false
	}
	return m[1], strings.Contains(val, "omitempty")
}

func typeExpr(expr ast.Expr) string {
	switch t := expr.(type) {
	case *ast.Ident:
		return t.Name
	case *ast.StarExpr:
		return "*" + typeExpr(t.X)
	case *ast.ArrayType:
		return "[]" + typeExpr(t.Elt)
	case *ast.MapType:
		return "map[" + typeExpr(t.Key) + "]" + typeExpr(t.Value)
	case *ast.SelectorExpr:
		return typeExpr(t.X) + "." + t.Sel.Name
	case *ast.InterfaceType:
		return "interface{}"
	default:
		return "unknown"
	}
}

func fieldComment(field *ast.Field) string {
	if field.Doc != nil {
		return strings.TrimSpace(field.Doc.Text())
	}
	if field.Comment != nil {
		return strings.TrimSpace(field.Comment.Text())
	}
	return ""
}

func domainDirFromRoot(root string) string {
	return filepath.Join(root, "internal", "pkg", "v1", "domain")
}

func adapterDirFromRoot(root string) string {
	return filepath.Join(root, "internal", "pkg", "v1", "adapter", "api")
}

func appGoPathFromRoot(root string) string {
	return filepath.Join(root, "internal", "app", "api", "app.go")
}
