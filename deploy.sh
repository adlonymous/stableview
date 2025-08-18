#!/bin/bash

# StableView Monorepo Deployment Script
# This script helps deploy all packages to Vercel

set -e

echo "🚀 Starting StableView deployment to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Please install it with: npm i -g vercel"
    exit 1
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_error "You are not logged in to Vercel. Please run: vercel login"
    exit 1
fi

# Function to deploy a package
deploy_package() {
    local package_name=$1
    local package_path=$2
    local project_name=$3
    
    print_status "Deploying $package_name..."
    
    cd "$package_path"
    
    # Check if project is already linked
    if [ -f ".vercel/project.json" ]; then
        print_warning "$package_name is already linked to a Vercel project"
        read -p "Do you want to redeploy? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Skipping $package_name deployment"
            cd - > /dev/null
            return
        fi
    fi
    
    # Deploy to Vercel
    print_status "Running vercel deploy for $package_name..."
    
    # Use non-interactive mode for automation
    if vercel --yes --prod; then
        print_success "$package_name deployed successfully!"
        
        # Get the deployment URL
        local deployment_url=$(vercel ls | grep "$project_name" | head -1 | awk '{print $2}')
        if [ ! -z "$deployment_url" ]; then
            print_success "$package_name is available at: $deployment_url"
        fi
    else
        print_error "Failed to deploy $package_name"
        exit 1
    fi
    
    cd - > /dev/null
}

# Function to configure environment variables
configure_env_vars() {
    local package_name=$1
    local project_name=$2
    
    print_status "Configuring environment variables for $package_name..."
    
    # Get project ID
    local project_id=$(vercel ls | grep "$project_name" | head -1 | awk '{print $1}')
    
    if [ -z "$project_id" ]; then
        print_warning "Could not find project ID for $project_name. Please configure environment variables manually."
        return
    fi
    
    print_status "Project ID for $project_name: $project_id"
    print_warning "Please configure environment variables manually in the Vercel dashboard for project: $project_name"
}

# Main deployment process
print_status "Starting deployment process..."

# Deploy Core API first
deploy_package "Core API" "packages/core" "stableview-core-api"
configure_env_vars "Core API" "stableview-core-api"

# Get Core API URL for other packages
print_status "Getting Core API deployment URL..."
cd packages/core
CORE_API_URL=$(vercel ls | grep "stableview-core-api" | head -1 | awk '{print $2}')
cd - > /dev/null

if [ ! -z "$CORE_API_URL" ]; then
    print_success "Core API URL: $CORE_API_URL"
    print_warning "Please set NEXT_PUBLIC_CORE_API_URL=$CORE_API_URL in your app and admin projects"
else
    print_warning "Could not determine Core API URL. Please set it manually."
fi

# Deploy App (Frontend)
deploy_package "App (Frontend)" "packages/app" "stableview-app"
configure_env_vars "App (Frontend)" "stableview-app"

# Deploy Admin
deploy_package "Admin" "packages/admin" "stableview-admin"
configure_env_vars "Admin" "stableview-admin"

print_success "🎉 Deployment completed!"
echo
print_status "Next steps:"
echo "1. Configure environment variables in Vercel dashboard for each project"
echo "2. Set NEXT_PUBLIC_CORE_API_URL in app and admin projects"
echo "3. Test your deployed applications"
echo "4. Set up custom domains if needed"
echo
print_status "Environment variables needed:"
echo
echo "Core API Project:"
echo "- SUPABASE_URL"
echo "- SUPABASE_ANON_KEY"
echo "- SUPABASE_SERVICE_ROLE_KEY"
echo
echo "App Project:"
echo "- NEXT_PUBLIC_CORE_API_URL"
echo
echo "Admin Project:"
echo "- NEXT_PUBLIC_CORE_API_URL"
echo
print_warning "Remember to never commit sensitive environment variables to Git!" 