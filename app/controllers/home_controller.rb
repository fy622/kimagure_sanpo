require 'net/http'
require 'json'

class HomeController < ApplicationController
  def top
    # topページの表示
  end

  def result
    # JavaScriptで呼び出されるため、このアクションで直接処理は不要です
    # ビューで@route_dataが必要なら、その設定だけ行います。
  end

  def detail
    # resultページで生成したルートデータを取得
    route_data = JSON.parse(params[:route]) if params[:route]

    # ルートデータが存在する場合、@sitesを設定
    if route_data
      @sites = route_data["waypoints"]
    else
      @sites = []
    end
  end

  def generate_route
    # AJAXリクエストで呼び出されるエンドポイント
    distance = params[:distance].to_f
    latitude = params[:latitude].to_f
    longitude = params[:longitude].to_f

    # 円形のルート生成
    points = generate_circular_route(latitude, longitude, distance)

    # JSON形式で返す
    render json: { route: points }
  end

  private

  def generate_circular_route(lat, lon, distance_km)
    points = []
    num_points = 8
    earth_radius = 6371.0 # 地球の半径（km）

    (0...num_points).each do |i|
      angle = 2 * Math::PI * i / num_points
      delta_lat = (distance_km / earth_radius) * Math.cos(angle)
      delta_lon = (distance_km / earth_radius) * Math.sin(angle) / Math.cos(lat * Math::PI / 180)

      point_lat = lat + delta_lat * (180 / Math::PI)
      point_lon = lon + delta_lon * (180 / Math::PI)
      points << { latitude: point_lat, longitude: point_lon }
    end

    points
  end
end