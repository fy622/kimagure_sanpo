class RoutesController < ApplicationController
  protect_from_forgery with: :null_session

  require 'uri'
  require 'net/http'
  require 'json'

  def create
    # クライアントから送信されたデータを取得
    data = JSON.parse(request.body.read)
    latitude = data['latitude']
    longitude = data['longitude']
    distance = data['distance'].to_i * 1000 # kmをmに変換

    # Google Maps APIで史跡を検索
    google_maps_url = URI("https://maps.googleapis.com/maps/api/place/textsearch/json")
    google_maps_params = {
      query: "史跡",
      location: "#{latitude},#{longitude}",
      radius: 5000,
      key: ENV['GOOGLE_MAPS_API_KEY']
    }
    google_maps_url.query = URI.encode_www_form(google_maps_params)

    http = Net::HTTP.new(google_maps_url.host, google_maps_url.port)
    http.use_ssl = true
    request = Net::HTTP::Get.new(google_maps_url)
    response = http.request(request)

    if response.code.to_i != 200
      render json: { error: "Failed to fetch places from Google Maps API", details: response.body }, status: :bad_request
      return
    end

    places = JSON.parse(response.body)
    waypoints = places["results"].map do |place|
      "#{place['geometry']['location']['lat']},#{place['geometry']['location']['lng']}"
    end
    selected_waypoints = waypoints.size > 3 ? waypoints.sample(3) : waypoints

    # GraphHopper APIでルート生成
    graphhopper_url = URI("https://graphhopper.com/api/1/route")
    graphhopper_params = {
      profile: 'foot',
      key: ENV['GRAPHHOPPER_API_KEY'],
      point: ["#{latitude},#{longitude}"] + selected_waypoints,
      algorithm: 'round_trip',
      'round_trip.distance': distance
    }
    graphhopper_url.query = URI.encode_www_form(graphhopper_params)

    request = Net::HTTP::Get.new(graphhopper_url)
    response = http.request(request)

    if response.code.to_i != 200
      render json: { error: "Failed to fetch route from GraphHopper API", details: response.body }, status: :bad_request
      return
    end

    route = JSON.parse(response.body)

    # 必要なデータのみを返す
    render json: {
      waypoints: selected_waypoints,
      route: route['paths'].map { |path| { distance: path['distance'], time: path['time'], points: path['points'] } }
    }
  end
end