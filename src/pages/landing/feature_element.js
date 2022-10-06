import './feature_element.css'

const FeatureEle = props => {
  return(
    <div class="fele">
        <div class="ficon">{props.icon}</div>
        <h3>{props.name}</h3>
        <p>{props.data}</p>
    </div>
  );
}
export default FeatureEle;