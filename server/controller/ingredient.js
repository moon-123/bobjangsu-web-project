import * as ingredientsRepository from '../data/ingredient.js'



// 데이터 로드
const allData = await ingredientsRepository.fetch_data();
// const healthInfo = await ingredientsRepository.getInfo();


// getCategory 함수에서 사용
export async function getCategory(req, res) {
    try {

        const healthInfo = await ingredientsRepository.getInfo();
        const categoryId = req.params.id;

        const categoryName = req.query.categoryName;

        if (categoryName === '전체') {
            res.status(200).json({allData: allData.Grid_20171128000000000572_1.row, healthInfo: healthInfo});
        } else {
            const filteredData = filterDataByCategory(allData, categoryName);
            const categoryInfo = healthInfo.filter((item) => item.category === categoryName)
            res.status(200).json({allData: filteredData, healthInfo: categoryInfo });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// getOneEffect 함수에서 사용
export async function getOneEffect(req, res) {
    try {
        const ingredientID = req.params.id;
        const ingredientName = req.query.ingredientName;
        const oneEffect = allData.Grid_20171128000000000572_1.row.filter((item) => item.PRDLST_NM.trim() == ingredientName);
        res.status(200).json(oneEffect);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

function filterDataByCategory(data, categoryId) {
    const filteredData = [];
    for (const item of data.Grid_20171128000000000572_1.row) {
        if (item.EFFECT.includes(categoryId)) {
            filteredData.push(item);
        }
    }
    return filteredData;
}
