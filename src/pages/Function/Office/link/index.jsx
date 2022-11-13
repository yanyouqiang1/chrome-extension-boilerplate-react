import {render} from "react-dom";
import React from "react";
import 'antd/dist/antd.css';
import {Button, Card, Col, Modal, Popover, Radio, Row, Space, Typography} from "antd";
import {LinkRepo} from "../../../../Repository/linkRopo";
import {getCurrentTabsNoActive} from "../../chromeCommon";
import ModalJsonEdit from "../../../component/ModalJsonEdit";
import ModalJson from "../../../component/ModalJson";


class Link extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            datasource: []
        }

        this.linkRepo = new LinkRepo();
        this.dataInit();

        this.personSchema = [{
            title: '标题',
            dataIndex: 'title',
            initialValue: '默认值',
        }]
    }

    dataInit() {
        this.linkRepo.getDataFromRepository(data => {
            if (!data instanceof Array) {
                data = []
            }
            this.setState({
                datasource: data
            })
        })

        getCurrentTabsNoActive().then(tabs => {
            this.setState({
                tabs: tabs
            })
        })
    }

    //搜索
    placementChange(value) {
        let ts = this.state.datasource.filter(it => it.type == value);
        this.setState({
            datasource: ts
        })
    }

    deleteType(data) {
        if (confirm("确认删除吗？")) {
            let newData = this.linkRepo.deleteType(this.state.datasource, data.key);
            this.setState({
                datasource: newData
            })
        }
    }

    addType(typeData) {
        let newData = this.linkRepo.addType(this.state.datasource, typeData.typeName);
        this.setState({
            datasource: newData
        })
    }


    static get TYPE_SCHEMA() {
        return [
            {
                title: '类别名称',
                dataIndex: 'typeName',
                formItemProps: {
                    rules: [
                        {
                            required: true,
                            message: '此项为必填项',
                        },
                    ],
                },
            }
        ]
    }

    SELECT_TABS_SCHEMA() {
        const valueEnum = {}
        this.state.tabs?.forEach((tab, index) => {
            valueEnum[index] = {
                text: tab.title
            }
        })

        return [
            {
                title: '选择链接',
                dataIndex: 'tabSelect',
                valueType: 'select',
                valueEnum,
            },
            {
                title: '备注',
                dataIndex: 'remark'
            }
        ]
    }

    tabSelect(data, modalResult) {
        console.log(modalResult)
        const tabIndex = modalResult.tabSelect
        let link = {
            name: this.state.tabs[tabIndex].title,
            remark: modalResult.remark,
            url: this.state.tabs[tabIndex].url
        }
        let addLink = this.linkRepo.addLink(this.state.datasource, data, link);

        this.setState({
            datasource: addLink
        })
    }

    dataEdit(data, modalResult) {
        let newData = this.linkRepo.dataEdit(this.state.datasource, data, modalResult);
        this.setState({
            datasource: newData
        })
    }

    render() {
        return (
            <div>
                <Row gutter={24} justify="center" style={{marginTop: "20px"}}>
                    <Col span={18}>
                        <div style={{width: "100%", verticalAlign: "center"}}>
                            <Radio.Group onChange={e => this.placementChange(e.target.value)}>
                                <Space>
                                    {this.linkRepo.getTypes(this.state.datasource).map(type => (
                                        <Radio.Button value={type}>{type}</Radio.Button>
                                    ))}
                                </Space>
                            </Radio.Group>
                            <ModalJson trigger={<Button type={"primary"} style={{float:"right"}}>增加类别</Button>}
                                       onFinish={(data) => this.addType(data)} schema={Link.TYPE_SCHEMA}/>
                        </div>
                    </Col>
                    <Col span={24} style={{marginTop: "20px"}}>
                        <Row gutter={24} justify="center" style={{marginTop: "20px"}}>
                            {
                                this.state.datasource?.map(data => {
                                    return (
                                        <Col span={18}>
                                            <Card title={data.type} extra={(
                                                <>
                                                    <ModalJsonEdit title="编辑" value={data}
                                                                   trigger={(<Button type={"link"}>编辑</Button>)}
                                                                   onFinish={(modalResult) => this.dataEdit(data, modalResult)}/>
                                                    <Button type={"link"} danger
                                                            onClick={() => this.deleteType(data)}> 删除 </Button>

                                                    <ModalJson trigger={<Button type={"primary"}>添加Tab</Button>}
                                                               onFinish={(result) => this.tabSelect(data, result)}
                                                               schema={this.SELECT_TABS_SCHEMA()}/>

                                                </>
                                            )}>
                                                {data.links.map((link) => (
                                                    <>
                                                        <p>
                                                            <Popover content={link.url}>
                                                                <Typography.Link href={link.url} target="_blank">
                                                                    {link.name}
                                                                </Typography.Link>
                                                            </Popover>
                                                            <Typography.Text
                                                                type="secondary">{link.remark}</Typography.Text>
                                                        </p>
                                                    </>

                                                ))}
                                            </Card>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}

render(<Link/>, window.document.querySelector('#app-container'))
