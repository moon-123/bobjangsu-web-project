import mongoose from 'mongoose';
import { Userdata } from './userdata.js'

const userSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  userpassword: { type: String, required: true },
  username: { type: String, required: true },
  birthday: {
    type: {
        type: String,
        enum: ['solar', 'lunar'],
        required: true
    },
    year: {
        type: String,
        required: true
    }
},
  phnumber: { type: String, required: true },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{
  collection: 'user_information'
});

const User = mongoose.model('bob', userSchema);

export { User };

export async function findByUserid(userid) {
  try {
    return User.findOne({ userid });
  } catch (error) {
    console.error(error)
    throw new Error('사용자 아이디로 찾기 중 오류가 발생했습니다.')
  }
}

export async function findById(id) {
  try {
    return User.findById(id);
  } catch (error) {
    console.error(error)
    throw new Error('_id로 찾기 중 오류가 발생했습니다.')
  }
}

export async function createUser(user) {
  try {
    const newUser = new User(user);
    await newUser.save();
    return newUser._id.toString();
  } catch (error) {
    console.error(error)
    throw new Error('사용자 생성중 DB 오류가 발생했습니다.')
  }
}

export async function updateUser(id, updateData) {
  try {
    const result = await User.updateOne({ _id: id }, { $set: updateData });
    return result.modifiedCount === 1;
  } catch (error) {
    console.error(error)
    throw new Error('사용자 업데이트중 DB 오류가 발생했습니다.')
  }
}

export async function findByPhone(phone) {
  return User.findOne({ phnumber: phone });
}

export async function findByUsernamephnumber(username, phnumber) {
  try {
    return User.findOne({ username, phnumber });
  } catch (error) {
    console.error(error)
    throw new Error('사용자 이름, 폰번호로 DB 찾기 중 오류가 발생했습니다.')
  }
}

export async function updatePassword(userid, hashedNewPassword) {
  try {
    const result = await User.updateOne({ _id: userid }, { $set: { userpassword: hashedNewPassword } });
    return result.modifiedCount === 1;
  } catch (error) {
    console.error(error)
    throw new Error('사용자 비밀번호 업데이트 중 DB 오류가 발생했습니다.')
  }
}

export async function healthGetById(id){
  try {
      return await Userdata.findOne({ id: id });
  } catch (error) {
      throw error;
  }
}

export async function getUserCompleteData(userId) {
  try {
      const userHealth = await healthGetById(userId);

      if (!userHealth) {
        return { weight: '정보 없음', height: '정보 없음', allergy: '정보 없음', energy: '정보 없음' };
    }

    return {
        weight: userHealth.weight || '정보 없음',
        height: userHealth.height || '정보 없음',
        allergy: userHealth.allergy || '정보 없음',
        energy: userHealth.energy || '정보 없음'
    };
  } catch (error) {
      throw error;
  }
}


export async function findUserAllData(userid) {
  try {
      const userhealthDataCollection = Userdata.collection;
      const userInfoCollection = User.collection;

      // Convert Mongoose _id to ObjectId
      const objectId =new mongoose.Types.ObjectId(userid);

      // Use Promise.all to fetch userHealthInfo and userInfo concurrently
      const userHealthInfo = await userhealthDataCollection.find({ id: userid }).toArray();
      const userInfo = await userInfoCollection.find({ _id: objectId }).toArray();

      if (userInfo.length === 0 || userHealthInfo.length === 0) {
          // Handle the case where no data is found for the given userid
          throw new Error('User data not found');
      }

      const data = {
          username: userInfo[0].username,
          phnumber: userInfo[0].phnumber,
          weight: userHealthInfo[0].weight,
          height: userHealthInfo[0].height,
          allergy: userHealthInfo[0].allergy,
          energy: userHealthInfo[0].energy
      };

      return data;
  } catch (error) {
      throw error;
  }
}

export async function updateUserInfo(id, newData){
  try {
      const userhealthDataCollection = Userdata.collection;
      // Use Promise.all to fetch userHealthInfo and userInfo concurrently
      const data = await userhealthDataCollection.updateOne({ id: id }, { $set: newData }, { returnDocument: 'after' });

      return data;
  } catch (error) {
      throw error;
  }
}