require 'net/http'
require 'json'

class RoutesController < ApplicationController
  protect_from_forgery with: :null_session

  def create
    distance = params[:distance].to_f
    latitude = params[:latitude].to_f
    longitude = params[:longitude].to_f

    # Directions APIでルートを生成
    points = generate_route_with_directions_api(latitude, longitude, distance)

    @route_data = points

    respond_to do |format|
      format.html
      format.json { render json: { route: points } }
    end
  end

  private

  def generate_route_with_directions_api(lat, lon, distance_km)
    api_key = ENV['GOOGLE_MAPS_API_KEY'] # Fly.ioなどで設定した環境変数
    origin = "#{lat},#{lon}"

    # 仮の距離調整: 指定距離（km）に基づいて目標地点を計算
    earth_radius = 6371.0 # 地球の半径 (km)
    delta_lat = (distance_km / earth_radius) * (180 / Math::PI)
    destination_lat = lat + delta_lat
    destination_lon = lon # 経度は固定（改善の余地あり）

    # URLエンコード
    destination = "#{destination_lat},#{destination_lon}"
    url = URI("https://maps.googleapis.com/maps/api/directions/json?" \
              "origin=#{URI::DEFAULT_PARSER.escape(origin)}&destination=#{URI::DEFAULT_PARSER.escape(destination)}&mode=walking&key=#{api_key}")

    # APIリクエストを送信
    response = Net::HTTP.get(url)
    data = JSON.parse(response)

    # APIレスポンスからルート情報を抽出
    if data['status'] == 'OK'
      route = data['routes'].first['legs'].first['steps'].map do |step|
        {
          latitude: step['end_location']['lat'],
          longitude: step['end_location']['lng']
        }
      end
      return route
    else
      # デバッグ用エラーログ
      Rails.logger.error "Google Maps API Error: #{data['status']}, #{data['error_message']}"
      raise "Google Maps API Error: #{data['status']}"
    end
  end
end