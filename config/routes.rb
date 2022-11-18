# frozen_string_literal: true

Rails.application.routes.draw do
  root :to => "web/boards#show"

  scope module: :web do
    resource :board, only: :show
    resource :session, only: [:new, :create, :destroy]
    resource :developers, only: [:new, :create]
  end

  namespace :admin do
    resources :users
  end
end
