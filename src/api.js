const baseUrl = process.env.REACT_APP_API_URL;

export const identifyImg = (file, types) => {
    const formData = new FormData()
    formData.append('image', file);
    types.forEach(type => formData.append('type', type));

    return request(`${baseUrl}/image`, {
        method: 'POST',
        body: formData
    })
};

export const readTicket = (file) => {
    const formData = new FormData()
    formData.append('image', file);
    formData.append('type', 'WEB_DETECTION');
    formData.append('type', 'TEXT_DETECTION');

    return request(`${baseUrl}/image`, {
        method: 'POST',
        body: formData
    });
};

const request = (url, opts) => {
    return fetch(url, opts).then(async response => {
        const json = await response.json();
        response.json = json;
        return processData(json);
    })
};

const processData = (data) => {
    const processedData = {};

    if(data.webDetection) {
        const {webEntities, visuallySimilarImages} = data.webDetection;

        processedData.webEntities = webEntities.map(item => item.description);
        processedData.visuallySimilarImages = visuallySimilarImages.map(item => item.url);
    }

    if(data.textAnnotations && data.textAnnotations.length) {
        processedData.text = data.textAnnotations.map(item => item.description);
    }

    if(data.faceAnnotations && data.faceAnnotations.length) {
        const props = ['joyLikelihood', 'sorrowLikelihood', 'angerLikelihood', 'surpriseLikelihood']

        const expresions = [];

        const face = data.faceAnnotations[0];

        Object.entries(face).forEach(([key, value]) => {
            if(props.indexOf(key) !== -1 && value === 'VERY_LIKELY') {
                expresions.push(key.replace('Likelihood', '').toUpperCase())
            }
        });

        processedData.expresions = expresions;
    }

    if(data.fullTextAnnotation) {
        //processedData.fullText = data.fullTextAnnotation.text;
    }

    // processedData.data = data;

    return processedData;
}
