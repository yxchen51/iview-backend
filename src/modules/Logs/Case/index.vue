<template>
  <div>
    <Modal
      width="300"
      v-model="del.modal"
      title="确认框"
      @on-ok="handleDelOk">
      <p>确认删除该记录？</p>
    </Modal>
    <Breadcrumb>
      <Breadcrumb-item href="/">首页</Breadcrumb-item>
      <Breadcrumb-item href="/logs">日志管理</Breadcrumb-item>
      <Breadcrumb-item>用例日志</Breadcrumb-item>
    </Breadcrumb>
    <List :current="current" :columns="columns" :data="items"
          :total="dataCount"
          @on-change="handlePageChange">
    </List>
  </div>
</template>

<script>
import { mapState } from "vuex";
import helpers from "apples/libs/helpers";
import consts from "@/utils/consts";
import time from "apples/libs/time";
import formatDate from "@/utils/commonUtils";
import List from "@/components/List";
import logsApi from "@/api/logs";

export default {
  name: "list",
  components: {
    List
  },
  data () {
    return {
      del: {
        modal: false,
        id: 0
      },
      id: null,
      // 初始化信息总条数
      dataCount: 0,
      current: 1,
      items: [],
      columns: [
        {
          title: "用例名称",
          key: "caseName"
        },
        {
          title: "用例描述",
          key: "caseDesc"
          // width: 150
        },
        {
          title: "用例等级",
          key: "casePriority"
        },
        {
          title: "用例类型",
          key: "caseType"
        },
        {
          title: "执行参数",
          key: "caseParam",
          width: 300
        },
        {
          title: "执行结果",
          key: "runResult"
        },
        {
          title: "开始时间",
          key: "caseStartTime",
          render (h, params) {
              return h('span', null, time.getDateTime(params.row.caseStartTime))
            }     
        },
         {
          title: "结束时间",
          key: "caseEndTime",
          render (h, params) {
              return h('span', null, time.getDateTime(params.row.caseEndTime))
            }     
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
          render: (h, params) => {
            return h('ButtonGroup', [
              h('Button', {
                props: {
                  type: 'ghost'
                },
                on: {
                  click: () => {
                    this.handleEdit(params.row.id)
                  }
                }
              }, '详情')
            ])
          }
        }
      ]
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.fetchData();
  },
  methods: {
    fetchData() {
      logsApi.queryCaseLog({
          pageNum: this.current ,
          pageSize: consts.PAGE_SIZE,
          parentLogId: this.id
        }).then(response => {
          if (response.ok) {
            // 保存取到的所有数据
            this.items = response.body.items;
            this.dataCount = response.body.pageMeta.total;
          } else {
          }
        }).catch(() => {
        
        });
    },
    handlePageChange(page) {
      console.log(page);
      this.current = page;
      this.fetchData();
    },
    handleSearch() {
      this.$set(this, "current", 1);
      this.fetchData();
    },
    handleEdit(id) {
      this.$router.push(`/logs/step/${id}`);
    },
    handleDel(id) {
      this.$set(this.del, "modal", true);
      this.$set(this.del, "id", id);
    },
    async handleDelOk() {
      await this.$store.dispatch("deleteArticle", {
        id: this.del.id
      });
      this.$Message.success("删除成功！");
      // iView.Spin 的坑，调用 iView.Spin.hide()，500ms 后实例才被销毁
      await helpers.sleep(500);
      this.get();
    }
  }
};
</script>
