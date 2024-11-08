class RoutesController < ApplicationController
    def create
      distance = params[:distance].to_f
      latitude = params[:latitude].to_f
      longitude = params[:longitude].to_f
  
      # 現在地をスタートとし、往復するルートを生成
      points = generate_route_with_start_and_return(latitude, longitude, distance)
  
      @route_data = points
  
      respond_to do |format|
        format.html
        format.json { render json: { route: points } }
      end
    end
  
    private
  
    def generate_route_with_start_and_return(lat, lon, distance_km)
      points = []
      earth_radius = 6371.0 # 地球の半径（km）
  
      # ルートの半分の距離だけ直線で移動し、戻るルートを生成
      half_distance = distance_km / 2.0
      angle = 45.0 * (Math::PI / 180.0) # ラジアンに変換
  
      points << { latitude: lat, longitude: lon }
  
      delta_lat = (half_distance / earth_radius) * Math.cos(angle)
      delta_lon = (half_distance / earth_radius) * Math.sin(angle) / Math.cos(lat * Math::PI / 180)
  
      point_lat = lat + delta_lat * (180 / Math::PI)
      point_lon = lon + delta_lon * (180 / Math::PI)
      points << { latitude: point_lat, longitude: point_lon }
  
      points << { latitude: lat, longitude: lon }
  
      points
    end
  end