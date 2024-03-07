package mongodb

import (
	"context"
	"server/util"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/grpc/codes"
)

var WebDatadb *mongo.Collection
var WebDataNum int

type WebData struct {
	ID   int `bson:"_id"`
	Name string
	Url  string
	tags []string
}

func init() {
	registerDBData(WebData{})
}

func (WebData) initTable() {
	WebDatadb = db.Collection("webData")
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeoutTime)
	defer cancel()
	// 创建一个排序条件，按降序排列
	sort := bson.D{{"_id", -1}}
	// 设置查询选项，仅返回一条文档
	options := options.FindOne().SetSort(sort)
	// 执行查询
	var result bson.M
	if err := WebDatadb.FindOne(ctx, bson.D{}, options).Decode(&result); err != nil {
		if err == mongo.ErrNoDocuments {
			WebDataNum = 0
		}
	} else {
		// 获取最大 ID 值
		WebDataNum = int(result["_id"].(int32))
	}
}

// 插入 WebData 表数据
func AddWebData(data WebData) (int, error) {
	WebDataNum++
	data.ID = WebDataNum
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeoutTime)
	defer cancel()
	res, err := WebDatadb.InsertOne(ctx, data)
	if err != nil {
		return 0, util.Errorf("add WebData %s failed to exec.", data.Name).WithCause(err)
	}

	return int(res.InsertedID.(int32)), nil
}

// 删除 WebData 表数据
func DeleteWebData(ID int) error {
	filter := bson.M{"_id": ID}
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeoutTime)
	defer cancel()
	result, err := WebDatadb.DeleteOne(ctx, filter)
	if err != nil {
		return util.Errorf("delete WebData with Name %d failed", ID).WithCause(err)
	}
	// ignore not found error
	if result.DeletedCount == 0 {
		util.Errorf("delete WebData %d failed", ID).WithCause(err).WithCode(codes.NotFound).Log()
	}
	return nil
}

// 更新 WebData 表数据
func UpdateWebData(data WebData) error {
	filter := bson.M{"_id": data.ID}
	update := bson.M{"$set": data}
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeoutTime)
	defer cancel()
	result, err := WebDatadb.UpdateOne(ctx, filter, update)
	if err != nil {
		return util.Errorf("update WebData %s failed", data.Name).WithCause(err)
	}
	if result.ModifiedCount == 0 {
		return util.Errorf("update WebData %s failed", data.Name).WithCause(err).WithCode(codes.NotFound)
	}
	return nil
}

func GetWebDataByName(name string) (WebData, error) {
	filter := bson.M{"name": name}
	result := WebData{}
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeoutTime)
	defer cancel()
	err := WebDatadb.FindOne(ctx, filter).Decode(&result)
	if err != nil {
		return result, util.Errorf("get %s WebData failed", name).WithCause(err)
	}
	return result, nil
}

func GetWebDataByTags(tags []string) ([]WebData, error) {
	filter := bson.M{"tags": bson.M{"$all": tags}}
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeoutTime)
	defer cancel()
	cursor, err := WebDatadb.Find(ctx, filter)
	if err != nil {
		return nil, util.Errorf("get %s WebData failed", strings.Join(tags, ",")).WithCause(err)
	}
	defer cursor.Close(context.Background())

	var datas []WebData
	if err := cursor.All(context.Background(), &datas); err != nil {
		return nil, util.Errorf("get all attr failed").WithCause(err)
	}
	return datas, nil
}
