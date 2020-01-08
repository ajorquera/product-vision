import React, {useState} from 'react';
import JSONPretty from 'react-json-pretty';

import {identifyImg} from './api';

const styles = {
  imgContainer: {
    height: '200px',
    width: '200px',
    display: 'inline-block'
  }
}

function App() {

  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imgInfo, setImgInfo] = useState(null);

  const [isDetectText, setIsDetectText] = useState(false);
  const [isDetectFaces, setIsDetectFaces] = useState(false);
  const [isDetectWebEntities, setIsDetectWebEntities] = useState(false);

  const set = {
    isDetectText: setIsDetectText,
    isDetectFaces: setIsDetectFaces,
    isDetectWebEntities: setIsDetectWebEntities
  };

  const onChange = (e) => {
    const file = e.target && e.target.files && e.target.files[0];

    if (file) {
      analyzeImg(file);

      const reader = new FileReader();

      reader.onload = e => {
        setImgPreview(e.target.result);
      };

      reader.readAsDataURL(file);      
    }
  }

  const handleCheckboxChange = (name) => {
    return (e) => {
      const target = e.target;
      const value = target.checked;
      set[name](value);
    }
  }

  const handleError = (error) => {
    console.error(error)
  };

  const analyzeImg = (img) => {
    setLoading(true);
    const types = [];

    if(isDetectWebEntities) types.push('WEB_DETECTION');
    if(isDetectFaces) types.push('FACE_DETECTION');
    if(isDetectText) types.push('TEXT_DETECTION');

    identifyImg(img, types)
      .then(data => setImgInfo(data))
      .catch(handleError)
      .finally(() => setLoading(false));
  }

  return (
    <div>
      <form>
        
      <label>
          Detectar texto
          <input type="checkbox" checked={isDetectText} onChange={handleCheckboxChange('isDetectText')} />
        </label>
        <br/>

        <label>
          Detectar entidades web
          <input type="checkbox" checked={isDetectWebEntities} onChange={handleCheckboxChange('isDetectWebEntities')} />
        </label>
        <br/>

        <label>
          Detectar caras
          <input type="checkbox" checked={isDetectFaces} onChange={handleCheckboxChange('isDetectFaces')} />
        </label>
        <br/>


        <label>
          Selecciona una imagen
          <input type="file" accept="image/*" onChange={onChange} />
        </label>
        


      </form>
      {imgPreview && (
        <div style={styles.imgContainer}>
          <img style={{height: '100%', width: '100%'}} src={imgPreview} alt="product" />
        </div>
      )}
      {loading && (
        <div>Loading...</div>
      )}

      {!loading && imgInfo && (
        <div>
          {imgInfo.webEntities && (
            <div>
              <h4>Labels</h4>
              {imgInfo.webEntities.join(', ')}
            </div>
          )}
           {imgInfo.expresions && (
            <div>
              <h4>Emociones</h4>
              {imgInfo.expresions.join(', ')}
            </div>
          )}
          {imgInfo.text && (
            <div>
              <h4>Texto</h4>
              <p>{imgInfo.text[0]}</p>
            </div>
          )}
          {imgInfo.webEntities && (
            <div>
              <h4>Similar images</h4>
              {imgInfo.visuallySimilarImages.map(url => (
                <span style={styles.imgContainer}>
                  <img style={{height: '100%', width: '100%'}} src={url} alt="product" />
                </span>
              ))}
            </div>
          )}

          <pre>
            <JSONPretty id="json-pretty" data={imgInfo}></JSONPretty>
          </pre>
        </div>

      )}
    </div>
  );
}

export default App;
