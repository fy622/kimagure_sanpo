Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  root "home#top"
  
  resources :routes
  resources :sites
end
