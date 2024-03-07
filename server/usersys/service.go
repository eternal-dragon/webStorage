package usersys

import (
	"encoding/json"
	"fmt"
	"net/http"
	"server/util"
	"sync"

	"github.com/sirupsen/logrus"
	"google.golang.org/grpc/codes"
)

type authRequest struct {
	Username string
	Password string
}

func HandleRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var request authRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "无法解析请求体", http.StatusBadRequest)
		return
	}
	logrus.Infof("register:%v", request)

	if err := Register(request.Username, request.Password); err != nil {
		if util.HaveErrorCode(err, codes.InvalidArgument) {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprint(w, err.Error())
			return
		}
		if util.HaveErrorCode(err, codes.AlreadyExists) {
			w.WriteHeader(http.StatusConflict)
			fmt.Fprint(w, err.Error())
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err.Error())
		return
	}

	if err := util.AddSession(w, r, request.Username, util.RolePlayer); err != nil {
		util.Errorf("save session error:%s", request.Username).WithCause(err).Log()
		fmt.Fprint(w, err.Error())
		return
	}

	user, err := getUser(request.Username)
	if err != nil {
		fmt.Fprint(w, util.Errorf("register got some internal error.").WithCause(err))
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, util.EncodeJson(user))
}

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var request authRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "无法解析请求体", http.StatusBadRequest)
		return
	}
	logrus.Infof("login:%v", request)

	user, err := Login(request.Username, request.Password)
	if err != nil {
		if util.HaveErrorCode(err, codes.InvalidArgument) {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprint(w, err.Error())
			return
		}
		if util.HaveErrorCode(err, codes.NotFound) {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprint(w, err.Error())
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, err.Error())
		return
	}

	if err := util.AddSession(w, r, user.Name, user.Role); err != nil {
		util.Errorf("save session error:%s.", request.Username).WithCause(err).Log()
		fmt.Fprint(w, err.Error())
		return
	}

	// User login successful
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, util.EncodeJson(user))
}

var qMutex sync.Mutex

func GetUserFromCookie(w http.ResponseWriter, r *http.Request) *user {
	userName, _, err := util.GetUser(w, r)
	if err != nil {
		logrus.Error(util.Errorf("get hero failed").WithCause(err))
		return nil
	}
	user, err := getUser(userName)
	if err != nil {
		logrus.Error(err)
	}
	if user == nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprint(w, util.Errorf("User %s not found", userName).Error())
		return nil
	}
	return user
}
