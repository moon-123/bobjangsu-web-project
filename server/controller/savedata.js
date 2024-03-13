import * as RecipeRepository from '../data/savedata.js'

// fetch하는 함수
// 로그인한 사람의 저장된 데이터 중 대분류별로 분류하여 가져오는 함수
export async function getByType(req,res){
    try {
        const categoryId = req.query.id;
        const userId = req.id;
        
        const data = await RecipeRepository.getByUserid(userId);
        // 여기서 filteredData 선언

        const filteredData = data.filter(item => item.RCP_PAT2 === categoryId);
        res.status(200).json(filteredData);
    } catch (error) {
        res.status(500).json({ error: '1.Internal Server Error' });
    }
}

// 로그인한 사람의 저장된 데이터 중 레시피 이름 하나만 뽑아서 가져온다
export async function getRecipe(req, res) {
    try {
        const categoryId = req.query.id;
        const userId = req.id;
        const data = await RecipeRepository.getByUserid(userId);
        const oneEffect = data.filter((item) => {
            return item.RCP_NM.trim() === categoryId;
        });
        res.status(200).json(oneEffect);
    } catch (error) {
        res.status(500).json({ error: '2.Internal Server Error' });
    }
}

// userid로 걸러서 필터링한다
// 이부분 수정 고려 -> 위치
// export async function filterDataByCategory(categoryId, userId) {
//     const data = await RecipeRepository.getByUserid(userId);
//     return data.filter(item => item.RCP_PAT2 === categoryId);
// }


// router.post('/saveData',saveController.saveData);
// router.delete('/deleteData',saveController.deleteData);


// 데이터를 저장하는 함수, body에서 저 요소들을 받아오고 userid를 추가하여 data를 저장한다
export async function saveData(req, res){
    const { RCP_PAT2,RCP_NM  } = req.body;
    
    const userid = req.id;
    

    try {
        await RecipeRepository.saveData(
            userid,RCP_PAT2,RCP_NM
            );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// userid와 요리 이름을 받아서 삭제한다
// req 값에 이상한 값이 들어가면 에러나게 변경
// res.json 말고 res.status(200).json() 형식으로 변경할 것
// DELETE의 경우 
export async function deleteData(req, res){
    const id = req.id;
    const rcpname=req.query.id;

    try {
        await RecipeRepository.deleteData(id,rcpname);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}