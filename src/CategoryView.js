import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Animated, Image, TextInput, Button, InteractionManager, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import Dialog, { DialogTitle, DialogContent,  DialogButton, } from 'react-native-popup-dialog';
import CheckBox from 'react-native-check-box'
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import Card from './components/CardProduct';
import Header from './components/Header';
const { width } = Dimensions.get('window');
class CategoryView extends Component {
  constructor(props){
    super(props);
    var {params} = this.props.navigation.state;
    this.state = {
      iCategories: params.iCategories,
      isActionButtonVisible: true, // показываеть или нет, строку поиска и кнопки
      filtered: false,  // запущен ли поиск по имени
      searchText: '',// текст поиска по имени
      textIngridients: '', // текст поиска по ингридиенту
      dialogVisibleSort: false, // вкл.-откл диалога сортировки
      dialogVisibleFilter: false, // вкл.-откл диалога ФИЛЬТР
      products:  this.props.products,
      iSort: 3, // value выбранного по умолчанию элемента сортировки
      didFinishInitialAnimation: false,

    }  
    offset = 0;
    this.onScroll = this.onScroll.bind(this);
    this.height = new Animated.Value(40);
  }
  static navigationOptions = ({ navigation }) => {
    return {
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
  renderProducts(){
    return (
      <View>
      {
        this.state.products.map((item, index) => (
              item.iCategories === this.state.iCategories ?
            <Card
              key={index}
              iProduct={item.iProduct}    
              iCategories = {this.state.iCategories}                 
              chName={item.chName}
              chMainImage={item.chMainImage}
              chPrice={item.chPrice}
              chDescription={item.chDescription}
              chOldPrice={item.chOldPrice}
              optionsProduct={item.options}
              tegsProduct={item.tegs}
              nav={this.props.navigation}
              />
              :
              null
            ))
          }
          </View>
        );
  }
     
    onScroll(event) {
        var currentOffset = event.nativeEvent.contentOffset.y;
        //this.setAnimation((event.nativeEvent.contentOffset.y > 40));
        //console.log(event.nativeEvent.contentOffset.y);
        
        const direction = (currentOffset > 0 && currentOffset > offset)
        ? 'down'
        : 'up'
        offset = currentOffset;
        const isActionButtonVisible = direction !== 'down';
        if (isActionButtonVisible !== this.state.isActionButtonVisible) {
            this.setState({ isActionButtonVisible: isActionButtonVisible })
        }
        //const filtered = direction !== 'up';
        if(direction === 'up')
        {
            this.setState({ filtered : false});
        }
    }
    dynamicSortNum() {
      var sortable = this.state.products.sort(function(first, second) {
          var a = parseFloat(first.chPrice);
          var b = parseFloat(second.chPrice);
          
          if(a > b) {
              return 1;
          } else if(a < b) {
              return -1;
          } else {
              return 0;
          }
      });
      //return sortable;
      //console.log(sortable);
      this.setState({products: sortable});
  }
    dynamicSort(property) {
      var sortOrder = 1;
      if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
      }
      return function (a,b) {
          var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
          return result * sortOrder;
      }
    }
    renderDialogSort()
    {
      return (
        <Dialog
          onTouchOutside={() => {
            this.setState({ dialogVisibleSort: false });
          }}
          width={0.9}
          visible={this.state.dialogVisibleSort}

          dialogTitle={
            <DialogTitle
              title="Сортировка"
              hasTitleBar={false}
              align='left'
              textStyle={{ color: '#F2F2F2', padding: 0, marginLeft: 10,}}
              style={{ backgroundColor: '#6A3DA1', padding: 10, margin: 0, borderRadius: 6,}}
            />
          }
          actions={[
            <DialogButton
              text="Отмена"
              textStyle={{ color: 'rgba(0, 0, 0, 0.38)', 
              fontFamily: 'Roboto',
              fontSize: 14,
              lineHeight: 16,
            }}
              onPress={() => {
                this.setState({ dialogVisibleSort: false });
              }}
              key="button-1"
            />,
            <DialogButton
              text="Принять"
              textStyle={{ color: '#6A3DA1',
              fontFamily: 'Roboto',
              fontSize: 14,
              lineHeight: 16,}}
              onPress={() => {
                this.setState({ dialogVisibleSort: false });
                this.sorting(this.state.iSort);
                console.log(this.state.iSort);
                
              }}
              key="button-2"
            />,
          ]}
        >
          <DialogContent>
          <RadioGroup 
                        selectedIndex={this.state.iSort - 1}
                        color='#6A3DA1'
                        style={{ marginTop: 15,}}
                        onSelect = {(index, value) => this.onSelectSort(index, value)} >
                        {/* По цене  */}
                        <RadioButton value={1}>
                            <Text style={styles.textStyle}>По цене </Text>
                        </RadioButton>
                        {/* По названию */}
                        <RadioButton value={2}>
                            <Text style={styles.textStyle}>По названию</Text>
                        </RadioButton>
                        <RadioButton value={3}>
                            <Text style={styles.textStyle}>По популярности</Text>
                        </RadioButton>
                        <RadioButton value={4}>
                            <Text style={styles.textStyle}>По новизне</Text>
                        </RadioButton>

                </RadioGroup>
          </DialogContent>
        </Dialog>
      )
    }
    // обработка нажатия радио-баттнона
    onSelectSort(index, value){
        this.setState({ iSort: value});
    }
    // обработка нажантия кнопки "Принять" в диалоговом окне "сортировки"
    sorting(value)
    {
        if(value === 1) // сортировка по цене
            this.dynamicSortNum();
        
        if(value === 2) // сортировка по имени
            this.setState( {products: this.state.products.sort(this.dynamicSort('chName')) });

        if(value === 3) // сортировка популярности
            this.setState({products: this.state.products});
    }
    //********** */ обработчики диалогового окна "сортировки"
    showDialogSort = () => { this.setState({ dialogVisibleSort: true }); };
      // обработчик кнопки отмены в диалоговом окне
    handleCancelSort = () => { this.setState({ dialogVisibleSort: false }); };
      // обработчик подтверждения в диалоговом окне 
    handleSort = () => { this.setState({ dialogVisibleSort: false }); };
    //********************************************************* */
    sortByTegs(idTag, chTag){

    }
    renderCheckBox(chColor, chTag, idTag){
      return (
        <View>
        <CheckBox 
          style={{flex: 1, padding: 10}}
          onClick={()=>{
            this.sortByTegs(idTag, chTag)
            //this.setState({ variable:!this.state.isCheckedNew })
          }}
          isChecked={this.state.isCheckedNew}
          rightText={chTag}
          uncheckedCheckBoxColor='rgba(0, 0, 0, 0.54)'
                checkedCheckBoxColor='#6A3DA1'
                rightTextStyle={{
                    fontFamily: 'Roboto',
                    fontWeight: '400',
                    fontSize: 14,
                    lineHeight: 24,
                    textalign: 'left',
                    color: '#4E4E4E',
                }}
            />
            <Text>{chTag}</Text>
            </View>
      )
    }
    renderDialogFilter()
    {
      return (
        <Dialog
          onTouchOutside={() => {
            this.setState({ dialogVisibleFilter: false });
          }}
          width={0.9}
          visible={this.state.dialogVisibleFilter}

          dialogTitle={
            <DialogTitle
              title="Фильтр"
              hasTitleBar={false}
              align='left'
              textStyle={{ color: '#F2F2F2', padding: 0, marginLeft: 10,}}
              style={{ backgroundColor: '#6A3DA1', padding: 10, margin: 0, borderRadius: 6,}}
            />
          }
          actions={[
            <DialogButton
              text="Отмена"
              textStyle={{ color: 'rgba(0, 0, 0, 0.38)', 
              fontFamily: 'Roboto',
              fontSize: 14,
              lineHeight: 16,
            }}
              onPress={() => {
                this.setState({ dialogVisibleFilter: false });
              }}
              key="button-1"
            />,
            <DialogButton
              text="Принять"
              textStyle={{ color: '#6A3DA1',
              fontFamily: 'Roboto',
              fontSize: 14,
              lineHeight: 16,}}
              onPress={() => {
                this.setState({ dialogVisibleFilter: false });
                this.filtered();
              }}
              key="button-2"
            />,
          ]}
        >
          <DialogContent>
            <Text style={{
                fontFamily: 'Roboto',
                fontWeight: '400',
                fontSize: 14,
                lineHeight: 24,
                textAlign: 'left',
                color: '#4E4E4E',
                marginTop: 5,
            }}>Поиск по ингредиенту </Text>
            <TextInput style={{
                backgroundColor: '#F3F3F3',
                borderRadius: 6,
                paddingTop: 0,
                paddingBottom: 0,
                
            }}
                placeholder = "Например: сыр"
                placeholderTextColor = "rgba(0, 0, 0, 0.24)"
                autoCapitalize = "none"
                value={this.state.textIngridients}
                blurOnSubmit={ false }

                onChangeText={ (textIngridients) =>  this.setState({ textIngridients: textIngridients  })
                }/>
            <Text style={{
                fontFamily: 'Roboto',
                fontWeight: '400',
                fontSize: 14,
                lineHeight: 24,
                textAlign: 'left',
                color: '#4E4E4E',
                marginTop: 5,
            }}>Поиск по тегу </Text>
            { console.log("this.props.tegs = ", this.props.tegs)}
          {
            this.props.tegs.map((t, i) => {
              this.renderCheckBox(t.chColor, t.chTag, t.idTag);
            })
            
          }
            {/*
            <CheckBox 
                style={{flex: 1, padding: 10}}
                onClick={()=>{
                  this.setState({
                    isCheckedNew:!this.state.isCheckedNew
                  })
                }}
                isChecked={this.state.isCheckedNew}
                rightText={"New (Новинка)"}
                uncheckedCheckBoxColor='rgba(0, 0, 0, 0.54)'
                checkedCheckBoxColor='#6A3DA1'
                rightTextStyle={{
                    fontFamily: 'Roboto',
                    fontWeight: '400',
                    fontSize: 14,
                    lineHeight: 24,
                    textalign: 'left',
                    color: '#4E4E4E',
                }}
            />
            <CheckBox 
                style={{flex: 1, padding: 10}}
                onClick={()=>{
                  this.setState({
                    isCheckedHit:!this.state.isCheckedHit
                  })
                }}
                isChecked={this.state.isCheckedHit}
                rightText={"Hit (Популярное) "}
                uncheckedCheckBoxColor='rgba(0, 0, 0, 0.54)'
                checkedCheckBoxColor='#6A3DA1'
                rightTextStyle={{
                    fontFamily: 'Roboto',
                    fontWeight: '400',
                    fontSize: 14,
                    lineHeight: 24,
                    textalign: 'left',
                    color: '#4E4E4E',
                }}
            />
            <CheckBox 
                style={{flex: 1, padding: 10}}
                onClick={()=>{
                  this.setState({
                    isCheckedSale:!this.state.isCheckedSale
                  })
                }}
                isChecked={this.state.isCheckedSale}
                rightText={"Sale (Скидка)"}
                uncheckedCheckBoxColor='rgba(0, 0, 0, 0.54)'
                checkedCheckBoxColor='#6A3DA1'
                rightTextStyle={{
                    fontFamily: 'Roboto',
                    fontWeight: '400',
                    fontSize: 14,
                    lineHeight: 24,
                    textalign: 'left',
                    color: '#4E4E4E',
                }}
            />
              */}
          </DialogContent>
        </Dialog>
      )
    }
    //********** */ обработчики диалогового окна "фильтр"
    showDialogFilter = () => { this.setState({ dialogVisibleFilter: true }); };
      // обработчик кнопки отмены в диалоговом окне
    handleCancelFilter = () => { this.setState({ dialogVisibleFilter: false }); };
      // обработчик подтверждения в диалоговом окне 
    handleFilter = () => { this.setState({ dialogVisibleFilter: false }); };
    //********************************************************* */

    /*
    setAnimation(enable) {
        Animated.timing(this.height, {
          duration: 400,
          toValue: enable ? 40 : 0
        }).start()
    }*/
    /// обработчик диалогового окна фильтрации по ингридиенту и тегам
    filtered()
    {
      //console.log(this.state.textIngridients);
      // по ингридиентам
      // проверяем, указан ли какой-то ингр
      if(this.state.textIngridients.length > 0) {
        var sortableIng = this.props.products.filter((el) => el.ingredients.length > 0 );
        var sortable= [];
        sortable =  sortableIng.filter((el) =>
          el.ingredients.some((f) =>
            f.chName.toLowerCase().indexOf(this.state.textIngridients.toLowerCase()) > -1    
          )
        );
            
      this.setState({ filtered : true});
      this.setState({ products: sortable });
      }
      else
        this.setState({ products: this.props.products });

    }
    searchOfName(searchText)
    {
        //const reg = new RegExp(searchText, 'gi');
        console.log(this.state.searchText);
        //this.setState({searchText});
        if(searchText.length > 0)
        {
            var sortable = this.props.products.filter((el) =>
                el.chName.toLowerCase().indexOf(searchText.toLowerCase()) > -1
            );
            this.setState({ filtered : true});
            this.setState({ products: sortable });
        }
        else
        {
           
            this.setState({ products: this.props.products });
        }
        
        
    }
    render() {
        return (
          
        <View style={styles.container}>
          {
            this.state.didFinishInitialAnimation === false ?
            <ActivityIndicator size="large" color="#583286" />
            :
            <View>
              { this.renderDialogSort() }
              { this.renderDialogFilter() }
              {
                this.state.isActionButtonVisible || this.state.filtered ? 
                <Animated.View style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: this.height, backgroundColor: '#FAFAFA', zIndex: 100,  elevation: 2, borderRadius: 2, 
                    flexDirection: 'row', justifyContent: 'space-between'}}>

                    <View style={{ height: 40, width: 40}}>
                        <Image
                            style={ styles.iconStyle }
                            source={require('../assets/iconSearch.png')}
                        /> 
                    </View>
                    <View style={{ height: 40, width: 240}}>
                    <TextInput style={styles.textInputStyle}
                            placeholder = "Search"
                            placeholderTextColor = "rgba(0, 0, 0, 0.24)"
                            autoCapitalize = "none"
                            value={this.state.chFIO}
                            blurOnSubmit={ false }

                            onChangeText={ (searchText) => this.searchOfName(searchText) }/>
                    </View>
                    <TouchableOpacity   onPress={() =>  this.setState({ dialogVisibleSort: true, }) }>
                    <View style={{height: 40, width: 40,}}>
                        <Image
                            style={{  width: 24,
                                height: 24, marginLeft: 10,
                                marginTop: 10, }}
                            source={this.state.dialogVisibleSort ? require('../assets/iconSortActive.png') : require('../assets/iconSort.png')}
                        />
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() =>  this.setState({ dialogVisibleFilter: true, })}>
                    <View style={{ height: 40, width: 40, }}>
                        <Image
                            style={{  width: 24,
                                height: 24, marginLeft: 10,
                                marginTop: 10, }}
                            source={this.state.dialogVisibleFilter ? require('../assets/iconFilterActive.png') : require('../assets/iconFilter.png')}
                        />
                    </View>
                    </TouchableOpacity>
            
                </Animated.View> 
                : null
            }
              <ScrollView  onScroll={this.onScroll} >
                  <View style={{height: 40, width: width}}></View>
                  {
                    this.state.products.filter(item => item.iCategories === this.state.iCategories).length === 0 ?
                    <View style={{
                      justifyContent: 'center', margin: 20, borderRadius: 10,
                      padding: 20,
                      alignItems: 'center', marginTop: 20, backgroundColor: '#eee',
                    }}>
                      <Text style={{ fontSize: 30, color: '#aaa', marginBottom: 40,}}>
                        Нет товаров 
                      </Text>
                      <Button
                        onPress={() => this.props.navigation.goBack()}
                        title="НАЗАД"
                        color="#583286"
                      />
                    </View>
                    :
                    this.renderProducts()
                  }
              </ScrollView>
            </View>
          }
            
        </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
  },
  img:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    opacity:.85,
  },
  iconStyle:{
      width: 24,
      height: 24,
      margin: 10,

  },
});
export default connect (
    state => ({
      tegs: state.TegsReducer,
      cart: state.CartReducer,
      products: state.ProductsReducer,
    }),
    dispatch => ({
      addCart: (index) => {
          dispatch({ type: 'ADD_CART', payload: index})
      },
      /*
      onAddCategory: (categoryData) => {
        dispatch({ type: 'ADD_CATEGORY', payload: categoryData});
      },
      onEditRootCategory: (categoryData) => {
        dispatch({ type: 'EDIT_ROOT_CATEGORY', payload: categoryData});
      },    
      onEditCategory: (categoryData) => {
        dispatch({ type: 'EDIT_CATEGORY', payload: categoryData});
      },*/
      
    })
  )(CategoryView);