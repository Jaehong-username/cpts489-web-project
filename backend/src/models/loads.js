const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Load = sequelize.define('Load', {
        pickup_city: { type: DataTypes.STRING, allowNull: false },
        pickup_state: { type: DataTypes.STRING, allowNull: false },
        dropoff_city: { type: DataTypes.STRING, allowNull: false },
        dropoff_state: { type: DataTypes.STRING, allowNull: false },

        pickup_date: { type: DataTypes.DATEONLY, allowNull: false },
        pickup_time_window_start: DataTypes.TIME,
        pickup_time_window_end: DataTypes.TIME,
        dropoff_date_start: DataTypes.DATEONLY,
        dropoff_date_end: DataTypes.DATEONLY,

        distance_miles: DataTypes.INTEGER,
        weight_lbs: DataTypes.INTEGER,
        oversized: DataTypes.BOOLEAN,
        hazmat: DataTypes.BOOLEAN,

        equipment_required: {
            type: DataTypes.ENUM('Dry Van', 'Reefer', 'Flatbed', 'Step Deck', 'Power Only'),
        },

        dimensions: DataTypes.STRING,
        pallet_count: DataTypes.INTEGER,
        temperature_requirement: DataTypes.STRING,
        loading_type: {
            type: DataTypes.ENUM('Dock', 'Liftgate', 'Forklift', 'Side Access'),
        },
        unload_instructions: DataTypes.TEXT,
        insurance_required_usd: DataTypes.INTEGER,

        commodity_type: {
            type: DataTypes.ENUM(
                'General Freight',
                'Refrigerated Goods',
                'Hazardous Materials',
                'Livestock',
                'Automobiles',
                'Heavy Equipment'
            ),
        },
        commodity_description: DataTypes.TEXT,
        material_safety_sheet_url: DataTypes.STRING,

        broker_worker_id: DataTypes.STRING,
        broker_name: DataTypes.STRING,
        broker_rating: DataTypes.FLOAT,
        broker_email: DataTypes.STRING,
        broker_phone: DataTypes.STRING,
        brokerage_name: DataTypes.STRING,
        brokerage_rating: DataTypes.FLOAT,

        posted_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    return Load;
};
