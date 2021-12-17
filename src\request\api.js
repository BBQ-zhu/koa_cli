//api接口统一管理文件
module.exports = {
    header: [{
            name: 'create',
            msg: '新增-'
        }, {
            name: 'upload',
            msg: '上传-'
        }, {
            name: 'del',
            msg: '删除-'
        }, {
            name: 'updat',
            msg: '修改-'
        }, {
            name: 'reset',
            msg: '重置-'
        }, {
            name: 'downLoad',
            msg: '下载-合同文件'
        },
        {
            name: 'Agent',
            msg: '首页-代办中心'
        },
        {
            name: 'Video',
            msg: '前端管理-创业学堂'
        },
        {
            name: 'Scroll',
            msg: '前端管理-轮播图片'
        },
        {
            name: 'Recruiting',
            msg: '前端管理-招聘专区'
        },
        {
            name: 'Product',
            msg: '前端管理-产品管理'
        },
        {
            name: 'News',
            msg: '前端管理-新闻管理'
        },
        {
            name: 'Internal',
            msg: '前端管理-内部资料'
        },
        {
            name: 'Vipuser',
            msg: '权限管理-客户管理'
        },
        {
            name: 'User',
            msg: '权限管理-员工管理'
        },
        {
            name: 'Role',
            msg: '权限管理-身份管理-角色管理'
        },
        {
            name: 'Team',
            msg: '权限管理-身份管理-团队管理'
        },
        {
            name: 'Customer',
            msg: '资料中心-贷款客户'
        },
        {
            name: 'Enterprise',
            msg: '资料中心-企业客户' 
        },
        {
            name: 'Mortgages',
            msg: '资料中心-抵押客户'
        },
        {
            name: 'Integrate',
            msg: '业务中心-综合服务'
        },
        {
            name: 'Contract',
            msg: '资料中心-合同中心'
        }, {
            name: 'ProductLogo',
            msg: '-产品logo'
        },
        {
            name: 'ProductClass',
            msg: '-产品分类'
        },
        {
            name: 'Iconl',
            msg: '-分类logo'
        },
        {
            name: 'loginuser',
            msg: '登录'
        },
        {
            name: 'Password',
            msg: '密码'
        },
        {
            name: 'Img',
            msg: '-图片'
        }
    ],
    //访问量统计
    findStatistics:'statistics/findStatistics',
    createStatistics:'statistics/createStatistics',
    updateStatistics:'statistics/updateStatistics',
    //内部资料
    createInternal: 'internal/createInternal',
    findInternal: 'internal/findInternal',
    updateInternal: 'internal/updateInternal',
    deleteInternal: 'internal/deleteInternal',
    //代办中心
    createAgent: 'agents/createAgent',
    deleteAgent: 'agents/deleteAgent',
    updateAgent: 'agents/updateAgent',
    findAgent: 'agents/findAgent',
    //上传员工头像
    userImgUrl: 'api/uploads/userImg', //假上传
    uploadUserImg: 'api/uploads/uploadUserImg', //User
    delateUserImg: 'uploads/delateUserImg',
    //上传创业学堂视频
    uploadVideoImg: 'api/uploads/uploadVideoImg',
    delateVideoImg: 'uploads/delateVideoImg',
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
    uploadProductLogo: 'api/uploads/uploadProductLogo',
    delProductLogo: 'uploads/delProductLogo',
    uploadProductImg: 'api/uploads/uploadProductImg',
    delProductImg: 'uploads/delProductImg',
    uploadProduct: 'uploads/uploadProduct',
    findProduct: 'uploads/findProduct',
    delateProduct: 'uploads/delateProduct',
    updataProduct: 'uploads/updataProduct',
    createProductClass: 'uploads/createProductClass', //创建产品分类
    findProductClass: 'uploads/findProductClass', //查询产品分类
    delProductClass: 'uploads/delProductClass', //删除产品分类
    uploadIconlImg: 'api/uploads/uploadIconlImg', //上传分类图标
    delIconlImg: 'uploads/delIconlImg', //上传分类图标
    //上传新闻信息
    findNews: 'informations/findNews',
    createNews: 'informations/createNews',
    updateNews: 'informations/updateNews',
    deleteNews: 'informations/deleteNews',
    //vip用户管理
    getCodeVipuser: 'vipuser/getCodeVipuser',
    checkCodeVipuser: 'vipuser/checkCodeVipuser',
    loginVipuser: 'vipuser/loginVipuser',
    findVipuser: 'vipuser/findVipuser',
    deleteVipuser: 'vipuser/deleteVipuser',
    updateVipuser: 'vipuser/updateVipuser',
    createVipuser: 'vipuser/createVipuser',
    //员工管理
    loginuser: 'user/loginuser',
    getSvg: 'user/getSvg',
    findUser: 'user/findUser',
    deleteUser: 'user/deleteUser',
    updateUser: 'user/updateUser',
    createUser: 'user/createUser',
    updatePassword: 'user/updatePassword',
    resetPassword: 'user/resetPassword',
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
    //客户客户
    findCustomer: 'customer/findCustomer',
    createCustomer: 'customer/createCustomer',
    updateCustomer: 'customer/updateCustomer',
    deleteCustomer: 'customer/deleteCustomer',
    //企业客户
    createEnterprise: 'customer/createEnterprise',
    deleteEnterprise: 'customer/deleteEnterprise',
    updateEnterprise: 'customer/updateEnterprise',
    findEnterprise: 'customer/findEnterprise',
    //抵押客户
    findMortgages: 'customer/findMortgages',
    createMortgages: 'customer/createMortgages',
    updateMortgages: 'customer/updateMortgages',
    deleteMortgages: 'customer/deleteMortgages',
    //咨询客户-综合服务
    createIntegrate: 'service/createIntegrate',
    deleteIntegrate: 'service/deleteIntegrate',
    updateIntegrate: 'service/updateIntegrate',
    findIntegrate: 'service/findIntegrate',
    //合同管理
    uploadContractImg: 'api/contract/uploadContractImg', //上传合同图片
    delContractImg: 'contract/delContractImg', //删除合同图片
    findContract: 'contract/findContract', //查询合同列表
    findOneContract: 'contract/findOneContract', //查询单个合同
    uploadContract: 'contract/uploadContract', //上传合同列表
    delateContract: 'contract/delateContract', //删除合同行
    updataContract: 'contract/updataContract', //更新合同
    //操作日志管理
    createlogs: 'logs/createlogs', //创建日志
    findlogs: 'logs/findlogs', //查询日志
    deletelogs: 'logs/deletelogs', //删除日志
}
