import Mongoose from 'mongoose';

export async function fetch_data() {
    try {
        const response = await fetch('http://211.237.50.150:7080/openapi/7d0f4e0303ecf3dc40527b620af70594287bbf951a99fec3463ae977515b7750/json/Grid_20171128000000000572_1/1/500');
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

const HealthInfoSchema = new Mongoose.Schema({
    category: String,
    content: String
  });

const HealthInfo = Mongoose.model('healthinfo', HealthInfoSchema);

export async function getInfo() {
    try {
        const healthInfoCollection = HealthInfo.collection
        // await healthdata.connectDB();
        // const he = healthdata.getinfos()
        // const healthcol = healthInfo.collection
        const data = await healthInfoCollection.find().toArray();
        return data
    } catch (error) {
        throw error;
    }
}