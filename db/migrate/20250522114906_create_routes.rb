class CreateRoutes < ActiveRecord::Migration[7.1]
  def change
    create_table :routes do |t|
      t.string :name
      t.float :distance
      t.float :time
      t.float :latitude
      t.float :longitude
      t.text :encoded_polyline

      t.timestamps
    end
  end
end
