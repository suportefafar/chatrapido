Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  root "rooms#index"
  
  resources :rooms, param: :token, only: [:create, :show] do
    post :join, on: :collection
    resources :messages, only: [:create]
  end
end
