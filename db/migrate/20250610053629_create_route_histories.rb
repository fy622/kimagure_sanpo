class CreateRouteHistories < ActiveRecord::Migration[7.1]
  def change
    create_table :route_histories do |t|
      t.references :user, null: false, foreign_key: true
      t.references :route, null: false, foreign_key: true

      t.timestamps
    end
  end
end
