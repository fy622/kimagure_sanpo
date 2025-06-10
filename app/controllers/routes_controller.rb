require 'net/http'
require 'uri'
require 'json'

class RoutesController < ApplicationController
  before_action :authenticate_user!, only: [:index]

  def create
    latitude = params[:latitude].to_f
    longitude = params[:longitude].to_f
    distance_km = params[:distance].to_f
    distance_m = distance_km * 1000

    # GraphHopper APIを使ってルート生成
    encoded_polyline, time_min = generate_graphhopper_route(latitude, longitude, distance_m)

    # ルートをDBに保存
    @route = Route.create!(
      distance: distance_km,
      time: time_min,
      latitude: latitude,
      longitude: longitude,
      encoded_polyline: encoded_polyline
    )

    # ログインしていれば履歴を保存
    if user_signed_in?
      RouteHistory.create!(user: current_user, route: @route)
    end

    # showへリダイレクト
    redirect_to route_path(@route)
  end

  def show
    @route = Route.find(params[:id])
    @center = { lat: @route.latitude, lng: @route.longitude }
    @route_points = @route.encoded_polyline
    @distance = @route.distance
  end

  private

  def generate_graphhopper_route(lat, lon, distance)
    query = URI.encode_www_form(
      point: "#{lat},#{lon}",
      profile: "foot",
      locale: "ja",
      instructions: false,
      algorithm: "round_trip",
      "round_trip.distance": distance,
      "round_trip.seed": rand(1000),
      key: ENV['GRAPHHOPPER_API_KEY']
    )

    url = URI("https://graphhopper.com/api/1/route?#{query}")
    Rails.logger.info "GraphHopper Request URL: #{url}"

    response = Net::HTTP.get(url)
    parsed = JSON.parse(response)

    raise "ルートが生成されませんでした" if parsed["paths"].blank?

    path = parsed["paths"][0]
    encoded_polyline = path["points_encoded"] ? path["points"] : nil
    time_min = path["time"].to_f / 1000 / 60 # ミリ秒 → 分

    [encoded_polyline, time_min.round(1)]
  end
end