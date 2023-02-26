function getDesriptionScale(len) {
    const descriptionScale = {
        x: 30,  //left - right
        y: 200,   //top - bottom
        color: "#ffffff",
        fontsize: 23
    }
    switch (true) {
        case (len < 100):
            descriptionScale.x = 30
            descriptionScale.y = 200
            return descriptionScale;
            break;
        case (len > 100 && len < 150):
            descriptionScale.x = 30
            descriptionScale.y = 150
            return descriptionScale;
            break;
        case (len > 150 && len < 200):
            descriptionScale.x = 30
            descriptionScale.y = 175
            return descriptionScale;
            break;
        case (len > 200 && len < 220):
            descriptionScale.x = 30
            descriptionScale.y = 165
            return descriptionScale;
            break;
        case (len > 220 && len < 300):
            descriptionScale.x = 30
            descriptionScale.y = 150
            return descriptionScale;
            break;
        case (len > 300 && len < 350):
            descriptionScale.x = 30
            descriptionScale.y = 130
            return descriptionScale;
            break;
        case (len > 350 && len < 400):
            descriptionScale.fontsize = 16
            descriptionScale.x = 30
            descriptionScale.y = 120
            return descriptionScale;
            break;
        case (len > 400 && len < 450):
            descriptionScale.fontsize = 18
            return descriptionScale;
            break;
        case (len > 450 && len < 500):
            descriptionScale.fontsize = 18
            return descriptionScale;
            break;
        case (len > 500 && len < 550):
            descriptionScale.fontsize = 18
            return descriptionScale;
            break;
        case (len > 550 && len < 600):
            descriptionScale.fontsize = 18
            return descriptionScale;
            break;
        case (len > 600 && len < 650):
            descriptionScale.fontsize = 18
            return descriptionScale;
            break;
        default:
            return descriptionScale;
    }
}

module.exports = {
    getDesriptionScale
}