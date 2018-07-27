<template>
  <div>
    <Breadcrumb>
      <Breadcrumb-item href="/">首页</Breadcrumb-item>
      <Breadcrumb-item href="/logs">日志管理</Breadcrumb-item>
      <Breadcrumb-item>项目日志</Breadcrumb-item>
    </Breadcrumb>
    <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="12" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        运行情况概要
                    </p>
                    <div class="data-source-row">
                        <visite-volume>
                          <div style="width:100%;height:100%;" id="data_source_con1">
                            <Row class="margin-top-8">
                                <Col span="8"><p class="notwrap">构建ID:</p></Col>
                                <Col span="16" class="padding-left-8" >{{projectLog.buildId}}</Col>
                            </Row>
                            <Row class="margin-top-8">
                                <Col span="8"><p class="notwrap">项目名称:</p></Col>
                                <Col span="16" class="padding-left-8">{{projectLog.projectName}}</Col>
                            </Row>
                            <Row class="margin-top-8">
                                <Col span="8"><p class="notwrap">执行人:</p></Col>
                                <Col span="16" class="padding-left-8">{{projectLog.runner}}</Col>
                            </Row>
                            <Row class="margin-top-8">
                                <Col span="8"><p class="notwrap">运行环境:</p></Col>
                                <Col span="16" class="padding-left-8">{{projectLog.runEnvironment}}</Col>
                            </Row>
                            <Row class="margin-top-8">
                                <Col span="8"><p class="notwrap">通过用例数:</p></Col>
                                <Col span="16" class="padding-left-8">{{projectLog.passCaseNum}}</Col>
                            </Row>
                            <Row class="margin-top-8">
                                <Col span="8"><p class="notwrap">失败用例数:</p></Col>
                                <Col span="16" class="padding-left-8">{{projectLog.failCaseNum}}</Col>
                            </Row>
                            <Row class="margin-top-8">
                                <Col span="8"><p class="notwrap">运行开始时间:</p></Col>
                                <Col span="16" class="padding-left-8">{{projectLog.startTime | formatDate}}</Col>
                            </Row> 
                            <Row class="margin-top-8">
                                <Col span="8"><p class="notwrap">运行结束时间:</p></Col>
                                <Col span="16" class="padding-left-8">{{projectLog.endTime | formatDate}}</Col>
                            </Row> 
                          </div>
                        </visite-volume>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="12" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>
                        通过率统计
                    </p>
                    <div class="data-source-row" >
                        <data-source-pie>
                          <div style="width:100%;height:165%;" id="data_source_con"></div>
                        </data-source-pie>
                    </div>
                </Card>
            </Col>
    </Row>

    <List :current="current" :columns="columns" :data="items"
          :total="dataCount"
          @on-change="handlePageChange">
      <ListHeader>
      </ListHeader>    
    </List>
  </div>
</template>

<script>
import echarts from "echarts";
import { mapState } from "vuex";
import helpers from "apples/libs/helpers";
import consts from "@/utils/consts";
import time from "apples/libs/time";
import formatDate from "@/utils/commonUtils";
import List, { ListHeader } from "@/components/List";
import logsApi from "@/api/logs";

export default {
  name: "list",
  components: {
    List,
    ListHeader
  },
  data() {
    return {
      del: {
        modal: false,
        id: 0
      },
      id: null,
      projectLog: {},
      // 初始化信息总条数
      dataCount: 0,
      current: 1,
      items: [],
      columns: [
        {
          title: "方法名称",
          key: "moduleName"
          // width: 300
        },
        {
          title: "通过数",
          key: "passCaseNum",
          width: 100
        },
        {
          title: "失败数",
          key: "failCaseNum",
          width: 100
        },
        {
          title: "运行结果",
          key: "runResult",
          width: 100
        },
        {
          title: "开始时间",
          key: "moduleStartTime",
          width: 150,
          render(h, params) {
            return h(
              "span",
              null,
              time.getDateTime(params.row.moduleStartTime)
            );
          }
        },
        {
          title: "结束时间",
          key: "moduleEndTime",
          width: 150,
          render(h, params) {
            return h("span", null, time.getDateTime(params.row.moduleEndTime));
          }
        },
        {
          title: "操作",
          key: "action",
          width: 100,
          render: (h, params) => {
            return h("ButtonGroup", [
              h(
                "Button",
                {
                  props: {
                    type: "ghost"
                  },
                  on: {
                    click: () => {
                      this.handleEdit(params.row.id);
                    }
                  }
                },
                "详情"
              )
            ]);
          }
        }
      ]
    };
  },
  mounted() {},
  // computed: getProjectLog(),
  created() {
    this.getProjectLog();
    this.fetchData();
  },
  filters: {
    formatDate(dateTime) {
      return time.getDateTime(dateTime);
    }
  },
  methods: {
    fetchData() {
      this.id = this.$route.params.id;
      logsApi
        .queryMethodLog({
          pageNum: this.current,
          pageSize: consts.PAGE_SIZE,
          parentLogId: this.id
        })
        .then(response => {
          if (response.ok) {
            // 保存取到的所有数据
            this.items = response.body.items;
            this.dataCount = response.body.pageMeta.total;
          } else {
          }
        })
        .catch(() => {});
    },
    getProjectLog() {
      this.id = this.$route.params.id;
      logsApi
        .getProjectLog(this.id)
        .then(response => {
          if (response.ok) {
            // 保存取到的所有数据
            this.projectLog = response.body;
            var dataSourcePie = echarts.init(
              document.getElementById("data_source_con")
            );
            const option = {
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: "vertical",
                left: "right",
                data: ["成功", "失败"]
              },
              series: [
                {
                  name: "运行结果",
                  type: "pie",
                  radius: "66%",
                  center: ["50%", "60%"],
                  data: [
                    {
                      value: response.body.passCaseNum,
                      name: "成功",
                      itemStyle: { normal: { color: "#9bd598" } }
                    },
                    {
                      value: response.body.failCaseNum,
                      name: "失败",
                      itemStyle: { normal: { color: "#e14f60" } }
                    }
                  ],
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                  }
                }
              ]
            };
            dataSourcePie.setOption(option);
            window.addEventListener("resize", function() {
              dataSourcePie.resize();
            });
          } else {
          }
        })
        .catch(() => {});
    },
    handlePageChange(page) {
      console.log(page);
      this.current = page;
      this.fetchData();
    },
    handleEdit(id) {
      this.$router.push(`/logs/case/${id}`);
    }
  }
};
</script>
