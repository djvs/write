Pt::Application.routes.draw do
 
  root 'application#angular'
  mount RailsAdmin::Engine => '/pt2882admin', :as => 'rails_admin'

  # This line mounts Forem's routes at /forums by default.
  # This means, any requests to the /forums URL of your application will go to Forem::ForumsController#index.
  # If you would like to change where this extension is mounted, simply change the :at option to something different.
  #
  # We ask that you don't use the :as option here, as Forem relies on it being the default of "forem"
  mount Forem::Engine, :at => '/forum'


#  resources :subs

  get 'partial/:partial' => 'partial#partial'
  match 'video' => 'video#index', via: [:get, :post]
  match 'video/new' => 'video#new', via: [:get, :post]

  match 'links' => 'links#index', via: [:get, :post]
  
  #poem goes to subs
  match 'poems' => 'subs#list', via: [:get, :post]
  match 'poems/:page' => 'subs#list', via: [:get, :post]
  get 'poem/:id' => 'subs#subredir'
  match 'poem/:id/edit' => 'subs#edit', via: [:get, :post]
  match 'poem/:id/reply' => 'subs#new', via: [:get, :post]
  match 'poem/:id/delete' => 'subs#delete', via: [:get, :post]

  #so does subs.  can't hurt right
  match 'subs' => 'subs#list', via: [:get, :post]
  match 'sub/edit' => 'subs#edit', via: [:get, :post]
  match 'subs/:page' => 'subs#list', via: [:get, :post]
  match 'sub/:id' => 'subs#show', via: [:get, :post]
  match 'sub/:id/reply' => 'subs#new', via: [:get, :post]
  match 'sub/:id/delete' => 'subs#delete', via: [:get, :post]

  

  
  match 'tag/save' => 'tag#save', via: [:get, :post]
  match 'tag/index' => 'tag#index', via: [:get, :post]
  match 'tag/:tag' => 'tag#show', via: [:get, :post]

  match 'tag/:tag/subs' => 'tag#subs', via: [:get, :post]
  match 'tag/:tag/users' => 'tag#users', via: [:get, :post]
  match 'tags/:type/:id' => 'tag#get', via: [:get]

  match '/comment' => 'comment#comment', via: [:get, :post]
  match '/comment/delete' => 'comment#delete', via: [:get, :post]

  # users 
  get 'me' => 'users#me'
  post 'me' => 'users#edit'
  match 'user/all' => 'users#index', via: [:get, :post]

  match 'user/id/:ursid' => 'users#show', :as => :user, via: [:get, :post]
  match 'user/id/:ursid/subs' => 'users#subs', via: [:get, :post]
  match 'user/id/:ursid/subs/:page' => 'users#subs', via: [:get, :post]

  match 'user/*ursername/subs' => 'users#subs', via: [:get, :post]
  match 'user/*ursername/subs/:page' => 'users#subs', via: [:get, :post]
  match 'user/*ursername' => 'users#show', via: [:get, :post]

  match 'me' => 'users#edit', via: [:get, :post]

  match 'about' => 'application#about', via: [:get, :post]

  post "login" => 'users#login'
  match "logout" => 'users#logout', via: [:get, :post]
  post "register" => 'users#signup'
  post "forgotpw" => 'users#forgotpw'

  devise_for :users, :controllers => {:passwords => "passwords"}

  #contest

  match 'contest' => 'subs#contest', via: [:get, :post]



  match 'chatr' => 'chat#index', via: [:get, :post]
  match 'chatr/newroom' => 'chat#newroom', via: [:get, :post]
  match 'chatr/:room' => 'chat#show', via: [:get, :post]
  match 'chatr/:room/refresh' => 'chat#refresh', via: [:get, :post] # unused?
  match 'chatr/:room/post' => 'chat#post', via: [:get, :post]

  # default route 

  #root :to => 'application#index2'
  match '/home' => 'application#index2', via: [:get, :post]
  match '/toc' => 'static#toc', via: [:get, :post]




  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)', via: [:get, :post]
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end
  
  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
  get "/*path" => "application#angular"

end
