import React from 'react';
import { Switch, StyleSheet, Text, TextInput, View, Dimensions, InteractionManager, TouchableOpacity, Image, ScrollView, Button, ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import AnimatedHideView from 'react-native-animated-hide-view';
import Dialog from "react-native-dialog";
//import Slider from '@react-native-community/slider';
import Slider from "react-native-slider";
import Header from './components/Header';
const { width } = Dimensions.get('window');
//import firebase from 'react-native-firebase';
class ProductDetailView extends React.Component {
  constructor(props){
    super(props);
    // фильтр продукта для отображения в карточке
    var {params} = this.props.navigation.state;
  
    console.log("===================================");
    
    const resultProduct = this.props.products.filter(products => products.iProduct ===  params.iProduct);
    //console.log("this.props.categories", this.props.categories);
    //console.log("resultProduct.iCategories", resultProduct[0].iCategories);
    //console.log(this.props.categories.find(x => x.iCategory ===  resultProduct[0].iCategories).chName);
    
    // фильтр опции по-умолчанию
    const resultOption = resultProduct[0].options.filter(offers => offers.blDefault ===  "true");
  
    if(resultOption.length > 0){      
      this.state = {
        selectPriceChange: resultOption[0].chPriceChange,
        selectIdSetsDetail: resultOption[0].idSetsDetail,
        selectOptionsName: resultOption[0].chName,
        addPriceIng: 0,
        ing: [],
        ingInCart: [],
        dialogVisible: false,
        viewLeftRigthCount: 0, // считает проходы при выводе кнопок добавления ингридиентов
        isViewIng: false,
        didFinishInitialAnimation: false,
        counter: 10, 
      }
    }
    else{
      this.state = {
        selectPriceChange: 0,
        selectIdSetsDetail: 0,
        selectOptionsName: 0,
        addPriceIng: 0,
        ing: [],
        ingInCart: [],
        dialogVisible: false,
        viewLeftRigthCount: 0,
        isViewIng: false,
        didFinishInitialAnimation: false,
        
      }
    }

    //console.log("params.idInCart = ",params.idInCart, "params.routeGoBack = ", params.routeGoBack);
    // выберевм продукт который нужно загрузить в карточке из корзины
    if(params.routeGoBack === 'inCart')
    {
      
       
      const resultProductInCart = this.props.cart.filter(cart => cart.idInCart ===  params.idInCart);
      ///  опции
      this.state.selectPriceChange = resultProductInCart[0].optionsPrice;
      this.state.selectIdSetsDetail = resultProductInCart[0].optionsId;
      this.state.selectOptionsName = resultProductInCart[0].optionsName;

      /// ингридиенты
      //console.log("все достепные ингридиенты resultProduct[0].ingredients ",  resultProduct[0].ingredients);
      //console.log("Выбранные ингридиенты resultProductInCart[0].ing", resultProductInCart[0].ing);
      // если при переходе из корзины, есть выбранные ингридиенты
      if(typeof resultProductInCart[0].ing !== 'undefined' && typeof resultProductInCart[0].ing.length !== 'undefined'){
        if(resultProductInCart[0].ing.length > 0) {
          // проходим по всем ингридиентам
          for(i = 0; i < resultProduct[0].ingredients.length; i++)
          {
            temp = resultProductInCart[0].ing.filter(ingInCart => ingInCart.idIngredients ===  resultProduct[0].ingredients[i].idIngredients);
            console.log("temp", temp);
            if(temp.length > 0)
              this.state.ing.push({'value':true, 'idIngredients':resultProduct[0].ingredients[i].idIngredients, 'chName': resultProduct[0].ingredients[i].chName, 'chPriceChange': resultProduct[0].ingredients[i].chPriceChange,})
            else
              this.state.ing.push({'value':false, 'idIngredients':resultProduct[0].ingredients[i].idIngredients, 'chName': resultProduct[0].ingredients[i].chName, 'chPriceChange': resultProduct[0].ingredients[i].chPriceChange,}) 
          }
        }
        else{
          resultProduct[0].ingredients.map(ing =>(
            this.state.ing.push({'value':false, 'idIngredients':ing.idIngredients, 'chName': ing.chName, 'chPriceChange': ing.chPriceChange,})
          ))
        }
      }
    }
    else{
      resultProduct[0].ingredients.map(ing =>(
          this.state.ing.push({'value':false, 'idIngredients':ing.idIngredients, 'chName': ing.chName, 'chPriceChange': ing.chPriceChange,})
      ))
    }
    this.addIngredient = this.addIngredient.bind(this);
  }
  static navigationOptions = ({ params }) => {

    return {
    title: 'Hererome',
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      textAlign: 'center',
    },
    header: (props) => <Header title={ null } {...props} />,
    headerRight: (
      <Button
        onPress={() => alert('This is a button!')}
        title="Info"
        color="#000"
      />
    ),
  };
};
  // Lifecycle methods
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        didFinishInitialAnimation: true,
      });
    });
  }
  generateKey = () => {
    return `${ new Date().getTime() }`;
  }
  showDialog = () => {
    this.setState({ dialogVisible: true });
  };
  // обработчик кнопки отмены в диалоговом окне
  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };
  // обработчик подтверждения в диалоговом окне 
  handleDelete = () => {
    this.setState({ dialogVisible: false });
    this.props.navigation.navigate('Phone');
  };
  renderDialog() {
    return (
      <Dialog.Container visible={this.state.dialogVisible}>
        <Dialog.Title>Предупреждение</Dialog.Title>
        <Dialog.Description>
          Для добавления товара в избранное, необходимо авторизоваться.
        </Dialog.Description>
        <Dialog.Button label="Отмена" onPress={this.handleCancel} />
        <Dialog.Button label="Авторизация" onPress={this.handleDelete} />
      </Dialog.Container>
    )
  }
  // функция добавления в избранное
  addToFavorite(iProduct){
    firebase.auth().onAuthStateChanged(user => {
      if(user){  
        this.addInDB(iProduct, this.props.user.userDB.chUIDGoogleUser)
      }
      else {
        this.showDialog();
        this.renderDialog();
      }
    })
  }
  addInDB(iProduct, UID){
    fetch(this.props.options.URL + 'InsertFavorite.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': "gzip, deflate",
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          UIDClient: this.props.options.UIDClient,
          UIDGoogleUser: UID,
          idProduct: iProduct,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        // Отображение ответного сообщения, поступающего с сервера после вставки записей.
        val = {
          key: this.generateKey(), 
          idFavorite: responseJson,
          idProduct: iProduct,
        };
        this.props.addFavorite(val);
      })
      .catch((error) => { console.error(error); 
    });
  }
  renderFavoriteButtom(iProduct)
  {
    const resultFav = this.props.favorite.filter(favorite => favorite.idProduct === iProduct);
    this.state.viewLeftRigthCount = 0;  
    if(resultFav.length > 0)
    { return (
        <TouchableOpacity style={styles.touchableOpacityImgFavStyle}
          onPress={() => { this.delToFavorite(resultFav[0].idFavorite, this.props.user.uid) }}>
          <Image
            style={ styles.imgFavStyle }
            source={require('../assets/iconHeartFav.png')}
          />  
        </TouchableOpacity>
      )
    }
    else { 
      return (
        <TouchableOpacity style={styles.touchableOpacityImgFavStyle}
          onPress={() => { this.addToFavorite(iProduct)}}>
          <Image
            //style={ styles.imgFavStyle }
            style={ styles.imgFavStyle }
            source={require('../assets/iconHeartNoFav.png')}
          />  
        </TouchableOpacity>
      )
    }
  }
  delToFavorite(idFavorite, UIDGoogleUser){
    fetch(this.props.options.URL + 'DelFavorites.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': "gzip, deflate",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UIDGoogleUser: UIDGoogleUser,
        idFavorite: idFavorite,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      // Отображение ответного сообщения, поступающего с сервера после вставки записей.
      val = {
        idFavorite: idFavorite,
      };
      this.props.delFavorite(val);
    })
    .catch((error) => { console.error(error); });
  }
  viewBtnOptions(options){
    if(options.length > 0)
    {
      return options.map((item, index) => (
        item.idSetsDetail === this.state.selectIdSetsDetail 
        ?
          <TouchableOpacity
            style={{elevation: 3, width: 40, marginRight: 30, marginTop: 15,marginBottom: 15,}}
            key={index} 
            onPress={() => {
              this.setState({
                selectPriceChange: item.chPriceChange,
                selectIdSetsDetail: item.idSetsDetail,
                selectOptionsName: item.chName,
              });
            }}>
            <Text style = {styles.btnWeightSelect}>{item.chName}</Text>
          </TouchableOpacity>
        :
          <TouchableOpacity
            style={{elevation: 3, width: 40, marginRight: 30, marginTop: 15,marginBottom: 15,}}
            key={index}
            onPress={() => {
              this.setState({
                selectPriceChange: item.chPriceChange,
                selectIdSetsDetail: item.idSetsDetail,
                selectOptionsName: item.chName,
              });
            }}>
            <Text style = {styles.btnWeight}> {item.chName} </Text>
          </TouchableOpacity>
        )
      );
    }
  }
  // отображение ингридиентов при помощи Switch 
  viewIngredientsOld(){

    if(this.state.ing.length > 0)
    {
      return this.state.ing.map((i, index) => (
        
        <View key={index} style={{flexDirection: 'row',}}>
          <Text style={{ marginTop: 3,}}>{i.chName}</Text>
          <Switch
            onValueChange={ (value) => this.addIngredient( value, i.idIngredients, i.chPriceChange, index)}
            value={ i.value } />
        </View>
      ))
    }
  }

  renderOneRowBtnIng(value, idIngredients, chPriceChange,  index, chName)
  {
    return <TouchableOpacity style={{elevation: 3, flex: 1, marginTop: 10, alignItems: 'flex-start'}}  
            onPress={() => {this.addIngredient( !value, idIngredients, chPriceChange, index) }}>
              <Text style={  value  ? styles.btnSelectIngSelect : styles.btnSelectIng }>
                {chName} - {chPriceChange +" "+ this.props.customers.chCurrency}
                </Text>
            </TouchableOpacity>
  }

  viewIngredients(index, id)
  {
    // если есть ингридиенты у этого товара, то выводим кнопки
    if(this.state.ing.length > 0)
    {
      // первый проход с индексом 0 и если ингр. больше 1, сразу выводим и второй
      if(index === 0)
      {
        // добавляет 1 при проходе
        this.state.viewLeftRigthCount = this.state.viewLeftRigthCount + 1
        // вывод кнопок первого ряда, с индексами 0 и 1
        // у TouchableOpacity свойство alignItems: 'flex-start', потому что первый ряд начинается слева
        return <View key={index} style={styles.viewBtnIng}>
        {
          this.renderOneRowBtnIng(this.state.ing[index].value, this.state.ing[index].idIngredients,  this.state.ing[index].chPriceChange,  index, this.state.ing[index].chName)}
            
            {
              this.state.ing.length != index+1 ?
              this.renderOneRowBtnIng(this.state.ing[index+1].value, this.state.ing[index+1].idIngredients,  this.state.ing[index+1].chPriceChange,  index+1, this.state.ing[index+1].chName)
             : null
            }
          </View>
      }
      else
      {
        if(index%2 === 0)
        {
          this.state.viewLeftRigthCount = this.state.viewLeftRigthCount + 1;
          return <View key={index} style={styles.viewBtnIng}>
              <TouchableOpacity style={{elevation: 3, flex: 1,  marginTop: 10,
          alignItems: this.state.viewLeftRigthCount%2 === 0 ? 'flex-end' : 'flex-start',
          marginRight: this.state.ing.length === index+1 ? 150 : 0,  }}  
          onPress={() => { this.addIngredient( !this.state.ing[index].value, this.state.ing[index].idIngredients, this.state.ing[index].chPriceChange, index) }}>
                <Text style={ this.state.ing[index].value ? styles.btnSelectIngSelect : styles.btnSelectIng }>
                  {this.state.ing[index].chName} - {this.state.ing[index].chPriceChange +" "+ this.props.customers.chCurrency}
                  </Text>
              </TouchableOpacity>
              {
                this.state.ing.length != index+1 ?
                <TouchableOpacity style={{elevation: 3, flex: 1,  marginTop: 10,
                  alignItems: this.state.viewLeftRigthCount%2 === 0 ? 'flex-end' : 'flex-start'

                }}  onPress={() => { this.addIngredient( !this.state.ing[index+1].value, this.state.ing[index+1].idIngredients, this.state.ing[index+1].chPriceChange, index+1) }}>
                <Text style={ this.state.ing[index+1].value ? styles.btnSelectIngSelect : styles.btnSelectIng }>
                  {this.state.ing[index+1].chName} - {this.state.ing[index+1].chPriceChange +" "+ this.props.customers.chCurrency}
                  </Text>
              </TouchableOpacity>
              : null
              }
          </View>
        }
      }
    }
  }
  addIngredient(value, id, price, i){
    let ing = [...this.state.ing];
    let index = ing.findIndex(el => el.idIngredients === id);
    ing[index] = {...ing[index], value: value};
    this.setState({ ing });

    if(value)
      this.setState({addPriceIng: Number(this.state.addPriceIng) + Number(price)})
    else
      this.setState({addPriceIng: Number(this.state.addPriceIng) - Number(price)})

    this.state.viewLeftRigthCount = 0; // однуляем счетчик порходов при нажатии кнопки добавления ингр.

  }
  renderBtnInCart(idProduct){
    const result = this.props.cart.filter(cart => cart.iProduct === idProduct);
    //console.log("this.props.navigation.state.params.routeGoBack = ", this.props.navigation.state.params.routeGoBack);
    
    if(result.length > 0)
      return ( <Text style = {styles.buttonText}>{this.props.navigation.state.params.routeGoBack === 'inCart' ? "СОХРАНИТЬ" : "ДОБАВИТЬ ЕЩЁ"}</Text> )
    else
      return(<Text style = {styles.buttonText}>В КОРЗИНУ</Text>)
    
    
    
  }
  render() {
    //console.log(this.props.categories);
    var {params} = this.props.navigation.state;
    const result = this.props.products.filter(products => products.iProduct ===  params.iProduct);
    
    return (
      <View style={{backgroundColor: '#fff', }}> 
      {
        this.state.didFinishInitialAnimation === false ?
        <ActivityIndicator size="large" color="#583286" />
        :
        <ScrollView>
          {this.renderDialog()}
          <View>
            <View style={{ flex: 1, alignItems: 'center', marginLeft: 32, marginRight: 32, marginBottom: 16}}>
                <Text style={ styles.titleName }>{result[0].chName }</Text>
                <Text style={{ paddingLeft: 10, color: '#828282', fontSize: 12, fontFamily: 'Roboto',}}>
                  {result[0].chDescription}
                </Text>
            </View>
            
          </View>
          {/* отображение главной картинки продукта */}
          <View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {/* добавление в избранное */}
            <View style={ styles.viewFav }>
              
              { this.renderFavoriteButtom(result[0].iProduct) }
            </View>
            <Image
              style={ styles.mainImg }
              source={ result[0].chMainImage === "" ? require('../assets/noImage.jpg') : { uri: result[0].chMainImage } }
            />
            
           </View>
              {
                result[0].tegs.length > 0 ?
                <View style={{zIndex: 10, marginTop: result[0].tegs.length > 1 ? -80 : -40}}>
                {result[0].tegs.map((t, index) =>(
                  <View key={index} style={{backgroundColor:  "#"+this.props.tegs.find(tf => tf.idTag === t.iTag).chColor,
                    width: 58, height: 19, marginLeft: 20, borderBottomEndRadius: 5,
                    borderTopRightRadius: 5, marginBottom: 10, }}>
                    <Text style={{color: '#FFFFFF', textAlign: 'center', fontSize: 10,
                      paddingTop: 2,}}>
                                    
                      { this.props.tegs.find(tf => tf.idTag === t.iTag).chTag }
                    </Text>
                  </View>
                  ))}
                  </View>  : null
              }
            
          </View>
          {/*кнопки опций */}
          <View style={{ flexDirection: 'row', alignItems: 'center', 
          justifyContent: 'center', marginTop: 20,}}>
            {this.viewBtnOptions(result[0].options)}
          </View>
          {
            result[0].blCounter === '0' ?
            <View style={{alignItems: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                <Text>Количество:</Text>
                <TextInput
                  style={{height: 20, borderColor: 'gray', color: '#fff',borderWidth: 1, width: 100,}}
                  onChangeText={(text) => this.setState({counter: text})}
                  value={'10'}
                  keyboardType={'numeric'}
                />
              </View>
              <Slider
                style={{width: width-48, height: 30, }}
                value={this.state.counter}
                step={1}
                thumbTintColor={'#6A3DA1'}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="#6A3DA1"
                maximumTrackTintColor="#ccc"
                thumbTouchSize={{width: 30, height: 30}}
                onValueChange={ (value) => this.setState({counter: value}) }
              />
              <Text>{this.state.counter}</Text>
            </View>
            :
            null
          }
          {/* выбор ингридиентов */}
          {
            this.state.ing.length > 0 ?
            <View style={ styles.viewViewHideIng }>
              <TouchableOpacity style={{elevation: 3, flex: 1,}}  
              onPress={() => { this.setState({isViewIng: !this.state.isViewIng}) }}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.textViewHideIng}> Добавить ингредиент </Text>
                <Image
                  style={styles.arrowBottom} 
                  source={ !this.state.isViewIng ? require('../assets/arrowBottom.png') : require('../assets/arrowTop.png')} 
                  
                  />
                </View>
              </TouchableOpacity>
            </View>
            :
            null
          }
          
          <AnimatedHideView
            visible={this.state.isViewIng}

            style={{ padding: 0, }}
            duration={10}>
            <View style={{marginLeft: 30, marginRight: 30, height: this.state.isViewIng ? 'auto' : 10,}}>
              { 
                result[0].ingredients.map((i, index) => (
                  this.viewIngredients(index, i.idIngredients) 
                ))
              }
              
            </View>
          </AnimatedHideView>
          

          {/* 
          <Slider
                style={{width: width-48, height: 30, }}
                value={this.state.counter}
                step={1}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="#ccc"
                maximumTrackTintColor="#000000"
                thumbTouchSize={{width: 30, height: 30}}
                onValueChange={ (value) => this.setState({counter: value}) }
            
              />
          */}
          <View style={{flexDirection: 'row', marginBottom: 20, marginTop: 20, justifyContent:'space-between'}}>
            <View style={{marginLeft: 13,}}>
              <Text style={ styles.textPrice }>              
                Цена {parseFloat(Number(result[0].chPrice) + Number(this.state.selectPriceChange) + Number(this.state.addPriceIng)).toFixed(2)+ " " + this.props.customers.chCurrency}
              </Text>
            </View>
            <View style={{marginTop: 10, marginRight: 10,}}>
              <TouchableOpacity
                style={{elevation: 3}}
                onPress={() => {
                  var val = {};
                  val = {     
                    key: this.generateKey(),
                    idInCart: this.props.navigation.state.params.routeGoBack === 'inCart' ? params.idInCart : this.generateKey(),
                    iProduct: result[0].iProduct,
                    iCategories: result[0].iCategories,
                    chMainImage: result[0].chMainImage,
                    chName: result[0].chName,
                    chDescription: result[0].chDescription,
                    chPrice: result[0].chPrice,
                    chOldPrice: this.props.chOldPrice,
                    optionsId: this.state.selectIdSetsDetail,
                    optionsPrice: this.state.selectPriceChange,
                    optionsName: this.state.selectOptionsName,
                    tegsProduct: result[0].tegs,
                    ing: this.state.ing.filter(op => op.value === true),
                  }
                  //console.log("val", val);
                  
                  if(this.props.navigation.state.params.routeGoBack === 'inCart')
                    //alert(params.idInCart)
                    this.props.editCart(val);

                  else
                    this.props.addCart(val);
              
                  // обнуляем счетчик вывода ингридиентов
                  this.state.viewLeftRigthCount = 0;      
                }}>
                
                {this.renderBtnInCart(params.iProduct)}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
    }
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleName:{
    fontFamily: 'OswaldSemiBold',
    fontSize: 20,
    color: '#4E4E4E',
    marginTop: 20,
    marginBottom: 20,
  },
  mainImg: {
    width: 360, 
    height: 360, 
    zIndex: 0,
  },
  imgFavStyle: {
    width: 26,  
    height: 21, 
    justifyContent: 'flex-end',
    zIndex: 10, 
    
  },
  touchableOpacityImgFavStyle: { 
    elevation: 3, 
    zIndex: 100,

  },
  viewFav: { 
    marginLeft: 32, 
    width: width-64,
    marginRight: 32,
    marginBottom: -26, 
    marginTop: 0, 
    justifyContent: 'flex-end', 
    alignItems: 'flex-end',
    zIndex: 1,
  },
  viewTitleStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textTitleStyle: {
    color: '#F891A9',
    fontSize: 25,
  },
  btnWeightSelect:{
    borderWidth: 0,
    borderColor: '#F891A9',
    backgroundColor: '#F891A9',
    color: '#fff',
    borderRadius: 20,
    textAlign: "center",
    width: 48,
    height: 24,
    fontFamily: 'Roboto',
    fontSize: 10,
    lineHeight: 12,
    paddingTop: 7,
  },
  btnWeight:{
      borderWidth: 1,
      borderColor: '#F891A9',
      backgroundColor: '#FFF',
      color: '#828282',
      borderRadius: 20,
      textAlign: "center",
      width: 48,
      height: 24,
      fontFamily: 'Roboto',
      fontSize: 10,
      paddingTop: 5,  
  },
  textPrice: {
    color: '#4E4E4E',
    fontWeight: '600',
    marginLeft: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 15, 
  },
  buttonText:{
    borderWidth: 0,
    padding: 8,
    borderColor: '#6A3DA1',
    backgroundColor: '#6A3DA1',
    color: '#fff',
    fontWeight: "600",
    borderRadius: 4,
    textAlign: "center",
    width: 120,
    fontFamily: 'OswaldMedium',
    fontSize: 12,
    marginRight: 16,
  },
  viewBtnIng:{
    flexDirection: 'row', 
  },
  btnSelectIngSelect:{
    marginTop: 3, 
    backgroundColor: '#6A3DA1', 
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 6,
    paddingTop: 10,   
    borderRadius: 20,
    color: '#F2F2F2',
    fontSize: 12,
    borderWidth: 2,
    borderColor: '#6A3DA1',
  },
  btnSelectIng:{
    marginTop: 3, 
    borderWidth: 2,
    borderColor: '#828282',
    color: '#4E4E4E',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 6,
    paddingTop: 10,
    borderRadius: 20,
    fontSize: 12,
  },
  viewViewHideIng:{
    backgroundColor: '#F2F2F2',
    padding: 10,
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 20,

  },
  textViewHideIng:{
    color: '#4E4E4E',
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 12,
    marginLeft: 10,

  },
  arrowBottom:
  {
    width: 15,
    height: 15,
    marginTop: 3,
    marginRight: 10,
  },

  
});
/*
const mapStateToProps = (state) => {
    const { friends } = state
    return { friends }
};
*/
  
//export default connect(mapStateToProps)(Home);

export default connect (
  state => ({
    cart: state.CartReducer,
    banners: state.BannerReducer,
    categories: state.CategoriesReducer,
    products: state.ProductsReducer,
    user: state.UserReducer,
    favorite: state.FavoriteReducer,
    options: state.OptionReducer,
    tegs: state.TegsReducer,
    customers: state.CustomersReducer,
  }),
  dispatch => ({
    addCart: (index) => {
      dispatch({ type: 'ADD_CART', payload: index})
    },
    editCart: (index) => {
      dispatch({ type: 'EDIT_CART', payload: index})
    },
    addFavorite: (index) => {
      dispatch({ type: 'ADD_FAVORITE', payload: index});
    },
    delFavorite: (index) => {
      dispatch({ type: 'DELETE_FAVORITE', payload: index});
    },
    /*
    clearIng: (index) => {
      dispatch({ type: 'CLEAR_ING', payload: index})
    }
    /*
    onEditRootCategory: (categoryData) => {
      dispatch({ type: 'EDIT_ROOT_CATEGORY', payload: categoryData});
    },    
    onEditCategory: (categoryData) => {
      dispatch({ type: 'EDIT_CATEGORY', payload: categoryData});
    },*/
  })
)(ProductDetailView);