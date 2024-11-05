require 'net/http'
require 'uri'
require 'json'

class HomeController < ApplicationController
  def top; end

  def result
    @distance = params[:distance].to_i
    @latitude = params[:latitude].to_f
    @longitude = params[:longitude].to_f
    @estimated_time = calculate_estimated_time(@distance)
    @route_distance = @distance
    @sites = get_sites_for_route(@latitude, @longitude, @distance)
  end

  def detail
    @route_data = params[:route_data]
    @sites = get_sites_for_route(@route_data[:latitude], @route_data[:longitude], @route_data[:distance])
  end

  private

  def calculate_estimated_time(distance)
    (distance / 4.5 * 60).round
  end

  def get_sites_for_route(latitude, longitude, distance)
    radius = (distance * 1000).to_i # 距離をメートルに変換
    api_key = "AIzaSyC400rVt1y2tFjUjjg_GzVLO5ZukCHgBUg" # 取得したAPIキーを設定

    url = URI("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=#{latitude},#{longitude}&radius=#{radius}&keyword=historical+site&key=#{api_key}")

    response = Net::HTTP.get(url)
    results = JSON.parse(response)["results"]

    results.map do |result|
      {
        name: result["name"],
        description: result["vicinity"],
        image_url: result.dig("photos", 0, "photo_reference") ? google_photo_url(result["photos"][0]["photo_reference"], api_key) : nil,
        rating: result["rating"]
      }
    end
  end

  def google_photo_url(photo_reference, api_key)
    "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=#{photo_reference}&key=#{api_key}"
  end
end
