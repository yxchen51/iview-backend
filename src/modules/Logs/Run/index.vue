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
      <Breadcrumb-item>运行日志</Breadcrumb-item>
    </Breadcrumb>
    <List :current="current" :columns="columns" :data="items"
          :total="dataCount"
          @on-change="handlePageChange">
      <ListHeader>
        <ListSearch>
          <Form ref="formInline" inline @submit.native.prevent="handleSearch">
            <Form-item prop="title" style="width: 300px;">
            <Col span="4"><p class="notwrap">构建ID:</p></Col>
            <Col span="8"><Input type="text" placeholder="请输入BuildId" v-model="buildId" style="width: 230px;"></Input></Col>
            </Form-item>
            <Form-item prop="title" style="width: 320px;">
            <Col span="4"><p class="notwrap">项目名称:</p></Col>
            <Col span="8"><Input type="text" placeholder="请输入项目名称" v-model="projectName" style="width: 230px;"></Input></Col>
            </Form-item>
            <Form-item prop="title" style="width: 320px;">
            <Col span="4"><p class="notwrap">运行环境:</p></Col>
            <Col span="8"><Input type="text" placeholder="请输入运行环境" v-model="runEnvironment" style="width: 230px;"></Input></Col>
            </Form-item>
            <Form-item>
              <Button type="primary" @click="handleSearch">查询</Button>
            </Form-item>
          </Form>
        </ListSearch>
      </ListHeader>
    </List>
  </div>
</template>

<script>
import { mapState } from "vuex";
import helpers from "apples/libs/helpers";
import consts from "@/utils/consts";
import time from "apples/libs/time";
import formatDate from "@/utils/commonUtils";
import List, {
  ListHeader,
  ListOperations,
  ListSearch
} from "@/components/List";
import logsApi from "@/api/logs";

export default {
  name: "list",
  components: {
    List,
    ListHeader,
    // ListOperations,
    ListSearch
  },
  data () {
    return {
      del: {
        modal: false,
        id: 0
      },
      runEnvironment: null,
      projectName: null,
      buildId: null,
      // 初始化信息总条数
      dataCount: 0,
      current: 1,
      items: [],
      columns: [
        {
          title: "构建ID",
          key: "buildId",
          width: 300
        },
        {
          title: "项目名称",
          key: "projectName"
          // width: 150
        },
        {
          title: "运行人",
          key: "runner",
          width: 100
        },
        {
          title: "运环境",
          key: "runEnvironment",
          width: 100
        },
        {
          title: "运行结果",
          key: "runResult",
          width: 100
        },
        {
          title: "开始时间",
          key: "startTime",
          width: 150,
          render (h, params) {
              return h('span', null, time.getDateTime(params.row.startTime))
            }     
        },
         {
          title: "结束时间",
          key: "endTime",
          width: 150,
          render (h, params) {
              return h('span', null, time.getDateTime(params.row.endTime))
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
  // computed: mapState(["articles"]),
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      logsApi.queryRunLog({
          pageNum: this.current ,
          pageSize: consts.PAGE_SIZE,
          buildId: this.buildId == "" ? null : this.buildId,
          projectName: this.projectName == "" ? null : this.projectName,
          runEnvironment: this.runEnvironment == "" ? null : this.runEnvironment
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
      this.$router.push(`/logs/method/${id}`);
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
