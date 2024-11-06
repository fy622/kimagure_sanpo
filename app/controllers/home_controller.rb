require 'net/http'
require 'json'

class HomeController < ApplicationController
  def top
    # topページの表示
  end

  def result
    distance = params[:distance].to_f * 1000 # 距離をメートルに変換
    user_location = current_location

    # ルート生成
    route_data = generate_route(distance, user_location)

    # 生成したルートデータを@route_dataに格納してビューで使用
    @route_data = route_data.to_json
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

  private

  def current_location
    # ユーザーのIPアドレスを使って現在地を取得
    # request.remote_ip は Rails でリクエストのIPアドレスを取得する方法
    location = Geocoder.search(request.remote_ip).first
    if location
      { lat: location.latitude, lng: location.longitude }
    else
      # 現在地が取得できない場合のデフォルト位置（例: 東京駅）
      { lat: 35.681, lng: 139.767 }
    end
  end

  def generate_route(distance, user_location)
    nearest_sites = find_nearest_sites(user_location, distance / 3)
    select_waypoints(nearest_sites, distance, user_location)
  end

  def find_nearest_sites(location, radius)
    # Google Places API の URL を作成
    api_key = ENV['GOOGLE_MAPS_API_KEY']
    base_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
  
    # パラメータをエンコードしてURLを作成
    params = {
      location: "#{location[:lat]},#{location[:lng]}",
      radius: radius,
      keyword: "史跡",
      key: api_key
    }
    url = URI("#{base_url}?#{URI.encode_www_form(params)}")
  
    response = Net::HTTP.get(url)
    results = JSON.parse(response)["results"]
  
    # 取得した史跡情報を配列に変換
    results.map do |result|
      {
        lat: result["geometry"]["location"]["lat"],
        lng: result["geometry"]["location"]["lng"],
        name: result["name"]
      }
    end
  end

  def select_waypoints(sites, target_distance, start_location)
    selected_waypoints = []
    total_distance = 0

    sites.each do |site|
      distance_to_site = calculate_distance(start_location, site)

      if total_distance + distance_to_site <= target_distance
        selected_waypoints.push(site)
        total_distance += distance_to_site
      end
    end
    { origin: start_location, destination: start_location, waypoints: selected_waypoints }
  end

  def calculate_distance(loc1, loc2)
    rad_per_deg = Math::PI / 180  # 度をラジアンに変換
    rm = 6371000 # 地球の半径（メートル）
  
    lat1_rad, lon1_rad = loc1[:lat] * rad_per_deg, loc1[:lng] * rad_per_deg
    lat2_rad, lon2_rad = loc2[:lat] * rad_per_deg, loc2[:lng] * rad_per_deg
  
    dlat_rad = lat2_rad - lat1_rad
    dlon_rad = lon2_rad - lon1_rad
  
    a = Math.sin(dlat_rad / 2)**2 + Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.sin(dlon_rad / 2)**2
    c = 2 * Math::atan2(Math::sqrt(a), Math::sqrt(1 - a))
  
    rm * c # メートルでの距離を返す
  end
end