class Route < ApplicationRecord
  has_many :route_histories, dependent: :destroy
  has_many :users, through: :route_histories
end
