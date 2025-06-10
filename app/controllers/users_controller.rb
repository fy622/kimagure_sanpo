class UsersController < ApplicationController
    before_action :authenticate_user!
  
    def mypage
      @user = current_user
      @routes = current_user.routes.order(created_at: :desc) 
    end
end