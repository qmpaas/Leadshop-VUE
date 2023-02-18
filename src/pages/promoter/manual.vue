<script>
import manualHead from './images/manual-head.png';
import manualProcess from './images/manual-process.png';

export default {
  name: 'manual',
  methods: {
    routerBack() {
      this.$router.back(-1);
    }
  },
  render() {
    const self = this;
    return (
      <div class="le-main">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>
            <a onClick={self.routerBack}>分销设置</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>分销商使用手册</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="le-card">
          <img src={manualHead} class="le-manual--head" width="800" height="160" alt="" />
          <div class="le-body">
            <div class="le-head">
              <div class="le-text">1.分销层级关系</div>
              <div class="le-line" />
            </div>
            <div class="le-content">
              <img src={manualProcess} width="704" height="260" class="le-process" alt="" />
              【关系说明】：
              <br />
              1. 分销商A邀请B成为分销商、分销商B邀请C成为分销商
              <br />
              2. 分销商A发展了用户1为自己的普通下线、分销商B邀请用户2为自己的普通下线、分销商C邀请用户3为自己的普通下线
              <br />
              【分销层级说明】：
              <br />
              1. 分销商B、用户1为分销商A的一级下线；分销商B、用户1下单购买商品，分销商A赚取一级分销佣金
              <br />
              2. 商家允许分销商自我绑定时，分销商A是自己的一级下线；下单购买商品赚取一级分销佣金
              <br />
              3. 分销商C、用户2为分销商A的二级下线；分销商C、用户2下单购买商品，分销商A赚取二级分销佣金
              <br />
              4. 用户3为分销商A的三级下线；用户3下单购买商品，分销商A赚取三级分销佣金
            </div>
            <div class="le-head">
              <div class="le-text">2. 分销商被清退的处理</div>
              <div class="le-line" />
            </div>
            <div class="le-content le-margin">
              【处理方式1】：
              <br />
              清退的分销商与下线之间的关系，全部解除，从此下线可自由绑定新的商家
              <br />
              【处理方式2】：
              <br />
              清退的分销商与下线之间的关系，转移给指定的分销商
              <br />
              【佣金处理】：
              <br />
              分销商的待结算佣金、待提现佣金仍归属于此已清退的分销商
            </div>
            <div class="le-head">
              <div class="le-text">3. 如何成为分销商</div>
              <div class="le-line" />
            </div>
            <div class="le-content le-margin">
              成为分销商的途径有二，一是通过商家的招募成为分销商，二是由分销商邀请，无论哪种方式，都需从【分销商招募】页面开始，完成接下来的申请流程
            </div>
            <div class="le-head">
              <div class="le-text">4. 分销商等级</div>
              <div class="le-line" />
            </div>
            <div class="le-content le-margin">
              1.支持十级等级权重，等级越高，权重越大；每个等级权重仅有一个分销等级
              <br />
              2.支持分销等级的自动升级，升级条件有：当前下线数、累计销售金额、累计佣金
              <br />
              3.自动升级方式，可选择满足任意条件或满足全部条件
              <br />
              4.分销等级的佣金设置原则为，同一个等级下，一级佣金需高于二、三级佣金；低等级的一级佣金需小于高等级的三级佣金
              <br />
              5. 新加入的分销商，条件满足某等级的升级条件时，初始等级则为满足升级条件的此分销等级
            </div>
            <div class="le-head">
              <div class="le-text">5. 分销关系绑定模式</div>
              <div class="le-line" />
            </div>
            <div class="le-content le-margin">
              1.上下线关系支持选择永久绑定模式和保护期模式；
              <br />
              2.永久绑定模式为，上下线关系一旦绑定，便不做更改，除非商家在后台干预
              <br />
              3.保护期模式意为，过了保护期的上下线关系将解除绑定，随之开始自由绑定关系；
              <br />
              4.原来在永久绑定模式下绑定的上下线关系，在设置为保护期模式后，将同样进入保护期模式。保护期的第一天为设置为保护期模式的当天，而非之前绑定关系的那一天
              <br />
              5.若商家对分销关系设置了保护期，将会导致分销商下线人员流失。当分销商当前的下线数不满足当前等级的升级条件时，将自动降级至满足条件的分销等级，并在分销商中心自动出弹窗进行降级提示。
              <br />
              6. 分销商的下线列表，统计每日的新增和流失下线数
            </div>
            <div class="le-head">
              <div class="le-text">6. 佣金结算</div>
              <div class="le-line" />
            </div>
            <div class="le-content le-margin">
              【结算节点】：
              <br />
              订单过售后时间，佣金方可结算给分销商
              <br />
              【佣金状态}；
              <br />
              待结算佣金：用户从付款至过售后时间段内的订单佣金
              <br />
              待提现佣金：过售后，但未申请提现的佣金
              <br />
              已提现佣金：申请提现了的佣金
              <br />
              累计佣金：待结算+待提现+已提现佣金
              <br />
              已结算佣金：待提现佣金+已提现佣金
              <br />
              【计算规则】：
              <br />
              1. 佣金比例*商品金额=佣金
              <br />
              2.
              商家可选择按照”商品金额“或”商品利润金额“来计算分销佣金；为确保商家不亏本，推荐商家使用商品利润金额计算佣金
              <br />
              3. 选择了利润金额计算佣金，添加分销商品时，需确保商品已设置成本价
              <br />
              【分销商提现】：
              <br />
              1. 支持自动到账微信零花钱、提现到微信、提现到支付宝、提现到银行卡；其中自动提现到微信零钱需在商户平台开通
              <br />
              2. 分销商申请提现，商家对提现申请进行审核和并打款
            </div>
            <div class="le-head">
              <div class="le-text">7.分销功能被禁用</div>
              <div class="le-line" />
            </div>
            <div class="le-content le-margin">
              1. 分销商不再享有新订单的佣金
              <br />
              2. 分销商邀请的新的用户，无法绑定关系
              <br />
              3. 申请成为分销商的用户，打开招募令页面，提示：商家暂停招募
              <br />
              4. 分销关系不变，再次开启时按原本的关系生效
            </div>
            <div class="le-head">
              <div class="le-text">8. 素材中心</div>
              <div class="le-line" />
            </div>
            <div class="le-content le-margin">
              1. 商家为分销商创建推广素材的，将显示在手机端素材中心，供分销商推广使用
              <br />
              2. 分销商使用素材的方式有二，一是一键发圈，即保存图片并复制文案；二是转发至分销商个人空间
            </div>
            <div class="le-head">
              <div class="le-text">9. 排行榜</div>
              <div class="le-line" />
            </div>
            <div class="le-content le-margin">
              1.手机端分销商中心，支持查看累计佣金、当前下线、累计销售金额的分销商排名
              <br />
              2. 排名维度由后台设置而定
            </div>
            <div class="le-head">
              <div class="le-text">10.空间动态</div>
              <div class="le-line" />
            </div>
            <div class="le-content le-margin">
              1. 定义：分销商个人的推广动态空间，如发布的商品素材、活动素材等，均作为动态显示在空间页面
              <br />
              2. 每个分销商都将拥有自己的专属空间，将空间转发给其他人，其他人点击后，可进入到此分销商专属的空间页面
              <br />
              3.
              商家可通过后台，发布官方动态，官方动态将显示在所有分销商的空间。即每个空间，只能看到一个分销商发布的动态，以及商家发布的官方动态
            </div>
          </div>
        </div>
      </div>
    );
  }
};
</script>

<style scoped lang="less">
@import './index.less';

.le-card {
  width: 800px;
  padding: 0;
  margin-top: 24px;
  border-radius: 40px 40px 16px 16px;
}

.le-manual--head {
  display: block;
}

.le-body {
  padding: 7px 48px 46px 48px;

  .le-head {
    display: inline-block;
    margin-top: 39px;

    .le-text:extend(.font-family-SC) {
      font-size: 20px;
      font-weight: bold;
      color: #2c1481;
      line-height: 22px;
    }

    .le-line {
      width: 100%;
      height: 8px;
      background: #ffb973;
      margin-top: -4px;
    }
  }

  .le-content:extend(.font-family-SC) {
    font-size: 14px;
    font-weight: bold;
    color: #262626;
    line-height: 22px;

    &.le-margin {
      margin-top: 24px;
    }
  }

  .le-process {
    margin: 52px 0 36px 0;
  }
}
</style>
