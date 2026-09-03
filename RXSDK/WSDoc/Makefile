.DEFAULT_GOAL := help

REGISTRY ?= haiqi-registry.cn-beijing.cr.aliyuncs.com/haiqiruixue
IMAGE_NAME ?= rx-docs
TAG ?= latest
PLATFORM ?= linux/amd64
IMAGE := $(REGISTRY)/$(IMAGE_NAME):$(TAG)
NODE_IMAGE ?= node:22-alpine
NGINX_IMAGE ?= nginxinc/nginx-unprivileged:alpine
BUILD_ARGS := --build-arg NODE_IMAGE=$(NODE_IMAGE) --build-arg NGINX_IMAGE=$(NGINX_IMAGE)

SAVE_IMAGE_URL ?= http://api.ruixueyun.com/api/v1/gwadmin/git/save_image
CREATER ?= ouyangjun@jixiang.cn
CPID ?= 2000144
PROJECT_ID ?= 3079
PROJECT_PATH ?= doc
BRANCH_NAME ?= $(TAG)
GITHASH ?= $(shell git rev-parse --short HEAD)
CMD_NAME ?= doc

.PHONY: help build-image push-image save-image release print-image

help:
	@echo "Usage:"
	@echo "  make build-image TAG=v1.0.2    Build image locally"
	@echo "  make push-image TAG=v1.0.2     Build and push image"
	@echo "  make save-image TAG=v1.0.2     Register image metadata"
	@echo "  make release TAG=v1.0.2        Push image and register metadata"
	@echo "  make release TAG=v1.0.2 NGINX_IMAGE=<mirror>/nginxinc/nginx-unprivileged:alpine"
	@echo ""
	@echo "Current image: $(IMAGE)"

build-image:
	docker buildx build \
		--platform $(PLATFORM) \
		$(BUILD_ARGS) \
		-t $(IMAGE) \
		--load .

push-image:
	docker buildx build \
		--platform $(PLATFORM) \
		$(BUILD_ARGS) \
		-t $(IMAGE) \
		--push .

save-image:
	curl -H "Content-Type: application/json" -X POST \
		-d '{"creater":"$(CREATER)","cpid":"$(CPID)","project_id":"$(PROJECT_ID)","project_path":"$(PROJECT_PATH)","branch_name":"$(BRANCH_NAME)","githash":"$(GITHASH)","cmd_name":"$(CMD_NAME)","image":"$(IMAGE)"}' \
		"$(SAVE_IMAGE_URL)"

release: push-image save-image

print-image:
	@echo "$(IMAGE)"
