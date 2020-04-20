const app = getApp();
Component({
  properties: {  
  },
  data: {
    app:false
  },
  ready() {
  },
  methods: {
    onAndroid(){
      this.setData({ app:!this.data.app})
    }
  }
})


