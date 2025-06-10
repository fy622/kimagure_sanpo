Rails.application.routes.draw do
  devise_for :users
  get "up" => "rails/health#show", as: :rails_health_check

  root "home#top"
  
  resources :routes

  get "mypage", to: "users#mypage", as: :mypage
end
