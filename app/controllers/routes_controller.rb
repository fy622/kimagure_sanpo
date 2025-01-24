require 'net/http'
require 'uri'
require 'json'

class RoutesController < ApplicationController
  def create
    latitude = params[:latitude]
    longitude = params[:longitude]
    distance = params[:distance].to_f * 1000 # 距離をメートルに変換

    # Google Maps APIで史跡を検索
    places_url = URI("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=#{latitude},#{longitude}&radius=5000&keyword=historical&key=#{ENV['GOOGLE_MAPS_API_KEY']}")
    places_response = Net::HTTP.get(places_url)
    places_data = JSON.parse(places_response)

    # 史跡の緯度・経度を取得
    waypoints = places_data['results'].map do |place|
      {
        latitude: place['geometry']['location']['lat'],
        longitude: place['geometry']['location']['lng']
      }
    end

    # GraphHopperでルート生成
    route = generate_graphhopper_route(latitude, longitude, distance, waypoints)

    # 結果をビューに渡す
    @route_points = route
    @waypoints = waypoints
    @center = { lat: latitude.to_f, lng: longitude.to_f }
    render :create
  end

  private

  def generate_graphhopper_route(lat, lon, distance, waypoints)
    # 現在地（スタート地点）をポイントに追加
    points = [{ latitude: lat, longitude: lon }] + waypoints
  
    # 経由地をクエリに追加
    points_query = points.map { |point| "point=#{point[:latitude]},#{point[:longitude]}" }.join("&")
  
    # GraphHopper APIのURLを生成
    graphhopper_url = URI("https://graphhopper.com/api/1/route?#{points_query}&profile=foot&key=#{ENV['GRAPHHOPPER_API_KEY']}")
  
    Rails.logger.info "GraphHopper Request URL: #{graphhopper_url}"
  
    response = Net::HTTP.get(graphhopper_url)
  
    Rails.logger.info "GraphHopper API Response: #{response}"
  
    parsed_response = JSON.parse(response)
  
    if parsed_response['paths'].nil? || parsed_response['paths'].empty?
      Rails.logger.error "No paths returned by GraphHopper API: #{response}"
      raise "ルートが生成されませんでした"
    end
  
    parsed_response['paths'][0]['points']
  end
end