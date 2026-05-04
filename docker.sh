#!/bin/bash

# Docker 环境管理脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# 检查 Docker 是否运行
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker 未运行，请先启动 Docker Desktop"
        exit 1
    fi
}

# 显示帮助信息
show_help() {
    echo "Yam UI Docker 环境管理工具"
    echo ""
    echo "用法: ./docker.sh [命令]"
    echo ""
    echo "命令:"
    echo "  dev         启动开发环境"
    echo "  prod        启动生产环境"
    echo "  stop        停止所有环境"
    echo "  clean       清理所有容器和镜像"
    echo "  logs        查看日志"
    echo "  build       构建镜像"
    echo "  restart     重启服务"
    echo "  status      查看状态"
    echo "  help        显示此帮助信息"
    echo ""
}

# 启动开发环境
start_dev() {
    check_docker
    print_info "启动开发环境..."
    
    if [ ! -f .env ]; then
        print_warn ".env 文件不存在，从示例复制..."
        cp .env.docker.example .env
    fi
    
    docker compose up -d yam-ui-dev
    print_info "开发环境已启动"
    print_info "访问地址: http://localhost:${VITE_SERVER_PORT:-5173}"
}

# 启动生产环境
start_prod() {
    check_docker
    print_info "构建生产镜像..."
    docker compose build yam-ui-prod
    
    print_info "启动生产环境..."
    docker compose --profile prod up -d yam-ui-prod
    
    print_info "生产环境已启动"
    print_info "访问地址: http://localhost:${PROD_PORT:-80}"
}

# 停止所有环境
stop_all() {
    check_docker
    print_info "停止所有环境..."
    docker compose down
    docker compose --profile prod down
    print_info "所有环境已停止"
}

# 清理资源
clean_all() {
    check_docker
    print_warn "这将删除所有容器、网络和镜像"
    read -p "确认继续？(y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "清理中..."
        docker compose down --rmi all -v
        docker compose --profile prod down --rmi all -v
        docker system prune -af
        print_info "清理完成"
    else
        print_info "操作已取消"
    fi
}

# 查看日志
view_logs() {
    check_docker
    local service=${1:-yam-ui-prod}
    print_info "查看 $service 的日志..."
    docker compose logs -f $service
}

# 构建镜像
build_images() {
    check_docker
    print_info "构建所有镜像..."
    docker compose build
    print_info "构建完成"
}

# 重启服务
restart_service() {
    check_docker
    local service=${1:-yam-ui-prod}
    print_info "重启 $service..."
    docker compose restart $service
    print_info "$service 已重启"
}

# 查看状态
show_status() {
    check_docker
    print_info "容器状态:"
    docker compose ps
    echo ""
    print_info "磁盘使用情况:"
    docker system df
}

# 主逻辑
case "${1:-help}" in
    dev)
        start_dev
        ;;
    prod)
        start_prod
        ;;
    stop)
        stop_all
        ;;
    clean)
        clean_all
        ;;
    logs)
        view_logs $2
        ;;
    build)
        build_images
        ;;
    restart)
        restart_service $2
        ;;
    status)
        show_status
        ;;
    help|*)
        show_help
        ;;
esac
