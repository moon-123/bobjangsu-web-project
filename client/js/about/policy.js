document.addEventListener('DOMContentLoaded', function () {
    const app = document.getElementById('app')
    const service = document.getElementById('service')
    const using = document.getElementById('using')

    const appInfo = document.getElementById('appInfo')
    const use = document.getElementById('use')
    const userInfoUse = document.getElementById('userInfoUse')
    app.addEventListener('click', ()=> {
        appInfo.style.display = 'block'
        use.style.display = 'none'
        userInfoUse.style.display = 'none'

        app.style.backgroundColor = '#F27521';
        app.style.color = 'white';
        service.style.backgroundColor = 'var(--bg-color)';
        service.style.color = '#F27521';
        using.style.backgroundColor = 'var(--bg-color)';
        using.style.color = '#F27521';
    })

    service.addEventListener('click', ()=> {
        appInfo.style.display = 'none'
        use.style.display = 'block'
        userInfoUse.style.display = 'none'

        app.style.backgroundColor = 'var(--bg-color)';
        app.style.color = '#F27521';
        service.style.backgroundColor = '#F27521';
        service.style.color = 'white';
        using.style.backgroundColor = 'var(--bg-color)';
        using.style.color = '#F27521';
    })

    using.addEventListener('click', ()=> {
        appInfo.style.display = 'none'
        use.style.display = 'none'
        userInfoUse.style.display = 'block'

        app.style.backgroundColor = 'var(--bg-color)';
        app.style.color = '#F27521';
        service.style.backgroundColor = 'var(--bg-color)';
        service.style.color = '#F27521';
        using.style.backgroundColor = '#F27521';
        using.style.color = 'white';
    })
});