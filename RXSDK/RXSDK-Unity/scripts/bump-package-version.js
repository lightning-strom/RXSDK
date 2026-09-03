#!/usr/bin/env node
/**
 * 将单个 package.json 的 version 及所有 com.ruixue.* 依赖版本设为指定版本
 * 用法: node bump-package-version.js <package.json 路径> <新版本号>
 */
var fs = require('fs');
var pathUtil = require('path');
var filePath = process.argv[2];
var newVersion = process.argv[3];
if (!filePath || !newVersion) {
  console.error('用法: node bump-package-version.js <package.json 路径> <新版本号>');
  process.exit(1);
}
var j = JSON.parse(fs.readFileSync(filePath, 'utf8'));
j.version = newVersion;
if (j.dependencies) {
  Object.keys(j.dependencies).forEach(function (k) {
    if (k.indexOf('com.ruixue.') === 0) j.dependencies[k] = newVersion;
  });
}
fs.writeFileSync(filePath, JSON.stringify(j, null, 2) + '\n');

var packagesDir = pathUtil.dirname(pathUtil.dirname(filePath));
var lockPath = pathUtil.join(packagesDir, 'packages-lock.json');
if (fs.existsSync(lockPath)) {
  var lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  lock.dependencies = lock.dependencies || {};
  var lockEntry = lock.dependencies[j.name] || {
    version: 'file:' + pathUtil.basename(pathUtil.dirname(filePath)),
    depth: 0,
    source: 'embedded',
    dependencies: {}
  };
  lockEntry.dependencies = lockEntry.dependencies || {};
  Object.keys(j.dependencies || {}).forEach(function (k) {
    if (k.indexOf('com.ruixue.') === 0) lockEntry.dependencies[k] = newVersion;
  });
  lock.dependencies[j.name] = lockEntry;
  lock.dependencies = Object.keys(lock.dependencies).sort().reduce(function (sorted, key) {
    sorted[key] = lock.dependencies[key];
    return sorted;
  }, {});
  fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n');
}
