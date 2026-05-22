PYTHONPATH=$(PWD)

# Tools (overridable)
BUN ?= bun
DOCKER ?= docker
DC ?= docker compose
TSC ?= ./node_modules/.bin/tsc

.PHONY: help install dev build preview lint lint-fix lint-all docker-build docker-run setup-dev setup-prod clean tsc ci

.DEFAULT_GOAL := help

help: ## Show available make targets
	@echo "Usage: make <command>"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-25s\033[0m %s\n", $$1, $$2}'

install: clean ## Install dependencies (uses Bun)
	$(BUN) install

dev: install ## Run development server (VitePress)
	$(BUN) run dev

build: install ## Build the static site (VitePress)
	$(BUN) run build

preview: install ## Preview the built site
	$(BUN) run preview

lint: ## Run ESLint for code, markdown and yaml
	$(BUN) run lint

lint-fix: ## Run ESLint --fix
	$(BUN) run lint:fix

lint-all: ## Run full lint pipeline
	$(BUN) run lint

docker-build: ## Build production Docker image (multi-stage: prod)
	$(DOCKER) build --tag transversal-doc --target prod .

docker-run: ## Run production Docker image (port 8080)
	$(DOCKER) run --publish 8080:8080 --rm transversal-doc

setup-dev: install ## Bring up dev stack with docker compose
	$(DC) up -d

setup-prod: docker-build docker-run ## Build and run production image
	@echo "Production image built and running."

clean: ## Stop compose and remove node modules and build artifacts
	-$(DC) down || true
	rm -rf node_modules
	rm -rf dist
	-$(DOCKER) image rm transversal-doc || true

tsc: install ## Typecheck project (no emit)
	$(TSC) -p tsconfig.json --noEmit

ci: install lint build tsc ## Run basic CI checks locally
	@echo "CI checks complete."
