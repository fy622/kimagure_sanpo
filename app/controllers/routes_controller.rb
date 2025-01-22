class RoutesController < ApplicationController
  protect_from_forgery with: :null_session # 必要に応じてCSRF対策を調整

  def create
    data = JSON.parse(request.body.read)
    latitude = data['latitude']
    longitude = data['longitude']
    distance = data['distance']

    # 必要なデータを処理
    @latitude = latitude
    @longitude = longitude
    @distance = distance

    render json: { latitude: @latitude, longitude: @longitude, distance: @distance }
  end
end