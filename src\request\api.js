//api接口统一管理文件
module.exports = {
    //上传员工头像
    userImgUrl: 'api/uploads/userImg', //假上传
    uploadImg: 'uploads/uploadImg',
    delateImg: 'uploads/delateImg',
    //上传创业学堂视频
    uploadVideo: 'api/uploads/uploadVideo',
    findVideo: 'uploads/findVideo',
    delateVideo: 'uploads/delateVideo',
    //上传轮播图
    findScrollImg: 'uploads/findScrollImg',
    delateScrollImg: 'uploads/delateScrollImg',
    uploadScrollImg: 'api/uploads/uploadScrollImg',
    //上传招聘信息
    uploadRecruiting: 'uploads/uploadRecruiting',
    findRecruiting: 'uploads/findRecruiting',
    delateRecruiting: 'uploads/delateRecruiting',
    updataRecruiting: 'uploads/updataRecruiting',
    //上传产品
    uploadProductImg: 'api/uploads/uploadProductImg',
    delProductImg: 'uploads/delProductImg',
    uploadProduct: 'uploads/uploadProduct',
    findProduct: 'uploads/findProduct',
    delateProduct: 'uploads/delateProduct',
    updataProduct: 'uploads/updataProduct',
    createProductClass: 'uploads/createProductClass', //创建产品分类
    findProductClass: 'uploads/findProductClass', //查询产品分类
    delProductClass: 'uploads/delProductClass', //删除产品分类
    uploadIconlImg:'api/uploads/uploadIconlImg', //上传分类图标
    delIconlImg:'uploads/delIconlImg', //上传分类图标
    //上传新闻信息
    findNews: 'informations/findNews',
    createNews: 'informations/createNews',
    updateNews: 'informations/updateNews',
    deleteNews: 'informations/deleteNews',
    //员工管理
    loginUser: 'user/loginUser',
    getSvg: 'user/getSvg',
    findUser: 'user/findUser',
    deleteUser: 'user/deleteUser',
    updateUser: 'user/updateUser',
    createUser: 'user/createUser',
    updatePassword: 'user/updatePassword',
    //权限管理
    findNavMenus: 'roles/findNavMenus',
    addRole: 'roles/addRole',
    delRole: 'roles/delRole',
    updateRole: 'roles/updateRole',
    findRole: 'roles/findRole',
    findOneRole: 'roles/findOneRole',
    addTeam: 'roles/addTeam',
    delTeam: 'roles/delTeam',
    findTeam: 'roles/findTeam',
    //客户资料
    findCustomer: 'customer/findCustomer',
    createCustomer: 'customer/createCustomer',
    updateCustomer: 'customer/updateCustomer',
    deleteCustomer: 'customer/deleteCustomer',
    //企业资料
    createEnterprise: 'customer/createEnterprise',
    deleteEnterprise: 'customer/deleteEnterprise',
    updateEnterprise: 'customer/updateEnterprise',
    findEnterprise: 'customer/findEnterprise',
    //咨询客户-综合服务
    createIntegrate: 'service/createIntegrate',
    deleteIntegrate: 'service/deleteIntegrate',
    updateIntegrate: 'service/updateIntegrate',
    findIntegrate: 'service/findIntegrate',

}
