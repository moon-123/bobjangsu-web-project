import Mongoose from "mongoose";

// 고객 건강 정보 저장을 위한 스키마
const userSchema = new Mongoose.Schema({
    id: { type: String, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    allergy: { type: String, required: true },
    energy: { type: Number, required: true }
});

const Userdata = Mongoose.model('user', userSchema);

export {Userdata}

// 고객 건강 정보 출력을 위한 확인
export async function getById(id) {
    try {
        const tableConnection = Userdata.collection; // Assuming getUsers is a Mongoose model
        // userdata 함수로부터 반환된 데이터베이스 연결을 사용하여 데이터를 가져오기
        const user = await tableConnection.find({ id: id }).toArray();
        return user;
    } catch (error) {
        throw error;
    }
}

// 고객 건강 정보 저장 (업데이트)
export async function save(id, weight, height, allergy, energy) {
    try {
        // 데이터베이스에 연결
        // await userdata(); // 데이터베이스에 연결하는 올바른 함수일 것으로 가정

        // User 모델을 사용하여 데이터 저장
        const newUser = new Userdata({
            id: id,
            weight: weight,
            height: height,
            allergy: allergy,
            energy: energy
        }).save();
        // 문서를 컬렉션에 저장
        // Optional: Output the collection name associated with the User model
        return newUser;
    } catch (error) {
        throw error;
    }
}

export async function update(id, weight, height, allergy, energy) {
    // 업데이트할 데이터를 객체로 만듭니다.
    const updateData = {
        weight,
        height,
        allergy,
        energy
    };

    // findByIdAndUpdate를 사용하여 데이터를 업데이트합니다.
    // { new: true } 옵션은 업데이트된 문서를 반환하도록 합니다.
    const update = Userdata.findOneAndUpdate({id:id}, updateData, {returnDocument: "after"});
    return update
}

export async function deleteMany(userId) {
    try {
        const result = await Userdata.deleteMany({ id: userId });
        return result.deletedCount;
    } catch (error) {
        throw error;
    }
}