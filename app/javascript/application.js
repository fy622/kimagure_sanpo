// Rails関連のライブラリをインポート
import * as Rails from "@rails/ujs";
Rails.start();

// 必要なモジュールをインポート
import "./modules/geolocation";
import "./modules/google_maps";
import "./modules/graphhopper";
import "./main";