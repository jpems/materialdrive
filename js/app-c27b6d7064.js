!function(){"use strict";angular.module("materialDrive",["ngMaterial","ngLocale","ngFileUpload","ui.router","materialDrive.tpls","infinite-scroll"]),angular.module("materialDrive.tpls",[])}(),function(){"use strict";function e(e,t){var n={google:["$q","$state","$location","google",function(e,t,n,o){var r=e.defer();return o.authorize(!0).then(function(){r.resolve(o)},function(){r.promise.then(null,function(){t.go("gate.sign",{redirect:n.url()})}),r.reject()}),r.promise}]},o={auth:["$q","$state","google",function(e,t,n){return n.prepareGapi().then(function(n){return n.authorize(!0).then(function(){t.go("drive.category",{category:"mydrive"})},function(){return e.resolve()})})}]};e.otherwise("/drive/mydrive"),t.state("gate",{url:"",templateUrl:"app/gate/gate.tpl.html",controller:"GateController as gateCtrl",resolve:o}).state("gate.sign",{url:"/sign?redirect",templateUrl:"app/gate/gate.tpl.html",controller:"GateController as gateCtrl",resolve:o}).state("drive",{url:"/drive",templateUrl:"app/drive/drive.tpl.html",controller:"DriveController as driveCtrl",resolve:n}).state("drive.category",{url:"/:category",templateUrl:"app/drive/drive-list.tpl.html",controller:["$scope","$stateParams",function(e,t){e.driveCtrl.init(t)}]}).state("drive.folder",{url:"/folder/:folderId",templateUrl:"app/drive/drive-list.tpl.html",controller:["$scope","$stateParams",function(e,t){e.driveCtrl.init(t)}]})}function t(e){e.interceptors.push(["$injector","$q",function(e,t){return{responseError:function(n){var o=e.get("$state"),r=e.get("google");return 401===n.status&&r.authorize(!0).then(function(){o.reload()},function(){o.go("gate")}),t.reject(n)}}}])}angular.module("materialDrive").config(["$urlRouterProvider","$stateProvider",e]).config(["$httpProvider",t])}(),function(){"use strict";function e(){var e={};return{addListener:function(t,n){var o=e[t];o||(e[t]=o=[]),o.push(n)},notify:function(t,n){var o=e[t];o&&angular.forEach(o,function(e){e.callback(n)})},removeListener:function(t,n){var o=e[t],r=0;if(o)for(r=0;r<o.length;r++)if(n===o[r].listener){o.splice(r,1);break}}}}angular.module("materialDrive").factory("notifier",[e])}(),function(){function e(){return{startsWith:function(e,t){return e.length>=t.length&&e.substring(0,t.length)===t},offset:function(e){for(var t=e,n=0,o=0;"undefined"!=typeof t.offsetTop;)n+=t.offsetTop,o+=t.offsetLeft,t=t.parentNode;return{top:n,left:o}}}}angular.module("materialDrive").factory("Util",e)}(),function(){"use strict";function e(e,i,a,l,s,c){var u;return{prepareGapi:function(){var e=this,t=i.defer();if(e.isReady())t.resolve(e);else var n=a(function(){e.isReady()&&(a.cancel(n),t.resolve(e))},100);return t.promise},isReady:function(){return angular.isDefined(gapi.auth)},authorize:function(e){var r=i.defer();return this.prepareGapi().then(function(){var t=function(){gapi.auth.authorize({client_id:n,scope:o,immediate:angular.isDefined(e)?e:!1},function(e){e&&e.access_token?r.resolve(e):r.reject()})};u?gapi.auth.checkSessionState({client_id:n,session_state:null},function(e){e?t():r.resolve(u)}):t()}),r.promise.then(function(e){u=e,t={params:{alt:"json"},headers:{Authorization:"Bearer "+u.access_token,"GData-Version":"3.0"}}})},isAuthenticated:function(){return angular.isDefined(t)},mimeType:c,query:s,about:function(){return e.get(r.ABOUT,angular.copy(t))},filesList:function(n){var o="?q="+encodeURIComponent(n.query);return n.mimeType&&(o+=" and mimeType = '"+n.mimeType+"'"),n.pageToken&&(o+="&pageToken="+encodeURIComponent(n.pageToken)),n.maxResults&&(o+="&maxResults="+n.maxResults),n.orderBy&&(o+="&orderBy="+n.orderBy),e.get(r.FILES_LIST+o,angular.copy(t))},filesGet:function(n){return e.get([r.FILES_GET,"?fileId=",encodeURIComponent(n)].join(""),angular.copy(t))},newFile:function(n){return e.post(r.INSERT_METADATA,{title:n.title,mimeType:n.mimeType,parents:n.parents?[n.parents]:""},angular.copy(t))},getUploadEndpoint:function(n){return e({url:r.INSERT_FILE.concat("?uploadType=resumable"),method:"POST",headers:t.headers,data:{title:n.file.fileName||n.file.name,mimeType:n.file.type||"application/octet-stream",parents:n.parents?[n.parents]:""}})},uploadFile:function(e){var n=0,o=e.file.size;return l.http({url:e.endpoint,method:"PUT",headers:angular.extend({"Content-Range":["bytes ",n,"-",o-1,"/",e.file.size].join(""),"X-Upload-Content-Type":e.file.type},t.headers),data:e.file.slice(n,o)})},duplicateFile:function(n){return e.post(r.FILES_COPY.replace("%s",n.fileId),null,angular.copy(t))},moveToTrash:function(n){return e.post(r.FILES_TRASH.replace("%s",n.fileId),null,angular.copy(t))},moveTo:function(n){return e.patch([r.FILES_PATCH.replace("%s",n.fileId),"?addParents=",n.toFolderId,"&removeParents=",n.fromFolderId].join(""),null,angular.copy(t))}}}var t,n="608120956255-0me03edqv60mf1eilgdjoum9qcmv4deq.apps.googleusercontent.com",o=["https://www.googleapis.com/auth/drive","https://www.googleapis.com/auth/drive.file","https://www.googleapis.com/auth/drive.readonly","https://www.googleapis.com/auth/drive.metadata.readonly","https://www.googleapis.com/auth/drive.appdata","https://www.googleapis.com/auth/drive.apps.readonly","https://www.googleapis.com/auth/userinfo.email","https://www.googleapis.com/auth/userinfo.profile"],r={ABOUT:"https://www.googleapis.com/drive/v2/about",FILES_LIST:"https://www.googleapis.com/drive/v2/files",FILES_GET:"https://www.googleapis.com/drive/v2/files/fileId",INSERT_FILE:"https://www.googleapis.com/upload/drive/v2/files",INSERT_METADATA:"https://www.googleapis.com/drive/v2/files",FILES_COPY:"https://www.googleapis.com/drive/v2/files/%s/copy",FILES_DELETE:"https://www.googleapis.com/drive/v2/files/%s",FILES_TRASH:"https://www.googleapis.com/drive/v2/files/%s/trash",FILES_PATCH:"https://www.googleapis.com/drive/v2/files/%s"};angular.module("materialDrive").factory("google",["$http","$q","$interval","Upload","query","mimeType",e]).constant("query",{incoming:"trashed = false and not 'me' in owners and sharedWithMe",recent:"(not mimeType = 'application/vnd.google-apps.folder') and lastViewedByMeDate > '1970-01-01T00:00:00Z' and trashed = false",starred:"trashed = false and starred = true",trash:"trashed = true and explicitlyTrashed = true",folder:"trashed = false and '%s' in parents",fullText:"trashed = false and fullText contains '%s'"}).constant("mimeType",{folder:"application/vnd.google-apps.folder",document:"application/vnd.google-apps.document",spreadsheet:"application/vnd.google-apps.spreadsheet",presentation:"application/vnd.google-apps.presentation"})}(),function(){"use strict";angular.module("materialDrive").directive("mtdContextMenu",[function(){function e(e,t,n,o){var r=this;e.onDropdownMenuSelected=function(t){e.onMenuSelected({menu:t})},e.$on("$destroy",function(){r._menuListElem.remove()}),e.contextMenuState={left:0,top:0,visibility:"hidden"},r.init=function(i){var a=angular.element("<mtd-dropdown></mtd-dropdown>"),l=angular.element(t[0].body);a.attr({"class":"context-menu","menu-list":"menuList","on-menu-selected":"onDropdownMenuSelected(menu)","ng-style":"contextMenuState"}),n(a)(e),l.append(a),l.on("click",function(){e.contextMenuState.display="none",e.$digest()}),i.on("contextmenu",function(t){var n,r,i;e.onPopup()&&(n=t.clientX,r=t.clientY,i=o.offset(this),n+a[0].clientWidth>i.left+this.clientWidth&&(n-=n+a[0].clientWidth-(i.left+this.clientWidth)),r+a[0].clientHeight>i.top+this.clientHeight&&(r-=r+a[0].clientHeight-(i.top+this.clientHeight)),e.contextMenuState.left=n+"px",e.contextMenuState.top=r+"px",e.contextMenuState.visibility="visible",e.contextMenuState.display="block"),e.$digest(),t.preventDefault()}),r._elem=i,r._menuListElem=a}}function t(e,t,n,o){o.init(t)}return{restrict:"A",scope:{menuList:"=",onPopup:"&",onMenuSelected:"&"},controller:["$scope","$document","$compile","Util",e],controllerAs:"contextMenuCtrl",link:t}}])}(),function(){"use strict";angular.module("materialDrive").directive("mtdDropdown",[function(){function e(e){this.onMenuSelected=function(t){e.callback({menu:t})}}return{restrict:"EA",scope:{menuList:"=",callback:"&onMenuSelected"},templateUrl:"app/common/dropdown.tpl.html",controller:["$scope",e],controllerAs:"dropdownCtrl"}}])}(),function(){"use strict";function e(e,t){return{compile:function(n,o){var r=e(o.mtdRightClick,null,!0);return function(e,n){n.on("contextmenu",function(n){var o=function(){r(e,{$event:n})};t.$$phase?e.$evalAsync(o):e.$apply(o)})}}}}angular.module("materialDrive").directive("mtdRightClick",["$parse","$rootScope",e])}(),function(){"use strict";function e(e){return{link:function(t,n,o){o.$observe("mtdFocus",function(t){t&&e(function(){n.find("input").focus()})})}}}angular.module("materialDrive").directive("mtdFocus",["$timeout",e])}(),function(){"use strict";function e(e,t,n){function o(){n.authorize(!1).then(function(){var n=t.params.redirect||"/drive/mydrive";e.url(n)})}var r=this;r.authorize=o}angular.module("materialDrive").controller("GateController",["$location","$state","google",e])}(),function(){"use strict";function e(e,t,n,o,r,i,a,l,s,c){function u(e){var t=(s.query[e.category]||s.query.folder).replace("%s",e.folderId||"root"),n=[],r=C.get("menuList");switch(e.category){case"incoming":r[1].selected=!0;break;case"recent":r[2].selected=!0;break;case"starred":r[3].selected=!0;break;case"trash":r[4].selected=!0;break;default:r[0].selected=!0}L.breadcrumb=S.get("breadcrumb"),L.status=S.get("status"),L.selectedItemMap={},L.currentFolder={isRoot:!0},L.contextMenuList=[{name:"Make a copy",icon:"content_copy",enabled:!0},{name:"Move to",icon:"folder_open",enabled:!0},{name:"Remove",icon:"delete",enabled:!0}],L.loaded=!1,L.itemListController={query:t,maxResults:20,orderBy:"folder,title asc",isBusy:!1,getItemAtIndex:function(e){return this.getMoreItems(e),this.items&&this.items[e]?this.items[e]:null},getMoreItems:function(e){if(!this.isBusy){var t=this;this.nextPageToken&&this.items&&this.items.length<=e+1&&(this.isBusy=!0,s.filesList({query:this.query,pageToken:this.nextPageToken,maxResults:this.maxResults,orderBy:this.orderBy}).success(function(e){t.isBusy=!1,t.nextPageToken=e.nextPageToken,t.items=t.items.concat(e.items)}),this.nextPageToken="")}},getLength:function(){return this.items?this.items.length:0}},n.push(s.filesList({query:t,orderBy:L.itemListController.orderBy,maxResults:L.itemListController.maxResults})),e.folderId&&n.push(s.filesGet(e.folderId)),o.all(n).then(function(e){var t=e[0].data;2===e.length&&(L.currentFolder=e[1].data,L.currentFolder.isRoot=0===L.currentFolder.parents.length),d(),L.itemListController=angular.extend(L.itemListController,t),L.loaded=!0})}function d(){var e,t,n=function(){return i.get("sidenav").get("menuList").filter(function(e){return e.selected})[0]};L.currentFolder.isRoot?(L.breadcrumb.splice(0,L.breadcrumb.length),L.breadcrumb.push(n())):(t=[L.currentFolder],(e=function(o){s.filesGet(o.id).success(function(o){o.parents[0]?(t.push(o),e(o.parents[0])):(L.breadcrumb.splice(0,L.breadcrumb.length),L.breadcrumb.push(n()),t.reverse().forEach(function(e){L.breadcrumb.push(e)}))})})(L.currentFolder.parents[0]))}function p(e,t){t?L.selectedItemMap[e.id]?(delete L.selectedItemMap[e.id],e.isSelected=!1):(L.selectedItemMap[e.id]=e,e.isSelected=!0):L.selectedItemMap[e.id]||(T(),L.selectedItemMap[e.id]=e,e.isSelected=!0),e.isSelected&&(L.selectedItem=e)}function m(e){e.labels.trashed||(e.mimeType===s.mimeType.folder?t.go("drive.folder",{category:t.params.category,folderId:e.id}):n.open(e.alternateLink))}function f(){t.go("drive.folder",{category:t.params.category,folderId:L.currentFolder.parents[0].id})}function g(e){s.newFile({title:e.name,mimeType:e.mimeType,parents:L.currentFolder.isRoot?"":L.currentFolder}).success(function(e){e.mimeType!==s.mimeType.folder&&n.open(e.alternateLink),u(t.params)})}function h(e){r.show({locals:{fileList:e.fileList,currentFolder:L.currentFolder},templateUrl:"app/dialog/upload-progress-dialog.tpls.html",escapeToClose:!1,clickOutsideToClose:!1,controllerAs:"modalCtrl",controller:"UploadProgressDialogController"}).then(function(){T(),u(t.params)})}function v(){var e=0,t=!1;return angular.forEach(L.selectedItemMap,function(n){e++,n.mimeType===s.mimeType.folder&&(t=!0)}),e?(L.contextMenuList[0].enabled=!(e>1||t),!0):!1}function y(e){switch(e.name){case"Make a copy":w();break;case"Remove":b();break;case"Move to":I()}}function T(){angular.forEach(L.selectedItemMap,function(e){e.isSelected=!1}),L.selectedItemMap={}}function w(){var e=[];angular.forEach(L.selectedItemMap,function(t,n){e.push(s.duplicateFile({fileId:n}))}),o.all(e).then(function(){T(),u(t.params)})}function b(){var e=r.confirm().title("Will be removed").ok("Yes").cancel("Cancel"),n="";angular.forEach(L.selectedItemMap,function(e){n=[n,'"',e.title,'", '].join("")}),e.content(n.substring(0,n.lastIndexOf(","))),r.show(e).then(function(){var e=[];angular.forEach(L.selectedItemMap,function(t,n){e.push(s.moveToTrash({fileId:n}))}),o.all(e).then(function(){T(),u(t.params)})})}function I(){r.show({controller:"NavigationDialogController",controllerAs:"vm",templateUrl:"app/dialog/navigation-dialog.tpl.html",bindToController:!0,clickOutsideToClose:!0,locals:{selectedItemMap:L.selectedItemMap}}).then(function(e){var n=[];angular.forEach(L.selectedItemMap,function(t,o){n.push(s.moveTo({fileId:o,fromFolderId:t.parents[0].id,toFolderId:e.id}))}),o.all(n).then(function(){T(),u(t.params)})})}function $(){return!(!a("gt-md")||!M.get("visible"))}var L=this,S=i.get("drive"),C=i.get("sidenav"),M=i.get("details");L.init=u,L.onContextMenuPopup=v,L.onContextMenuSelected=y,L.onItemClicked=p,L.onItemDoubleClicked=m,L.upToParentFolder=f,L.isScreenSize=a.bind(a),L.isDetailsLocked=$,L.mimeType=c,S||(S=i("drive"),S.put("breadcrumb",[]),S.put("status",{view:"list",search:!1})),C||(C=i("sidenav"),C.put("menuList",[{icon:"folder",label:"My Drive",href:"mydrive",index:0},{icon:"people",label:"Share with me",href:"incoming",index:1},{icon:"history",label:"Recent",href:"recent",index:2},{icon:"star",label:"Starred",href:"starred",index:3},{icon:"delete",label:"Trash",href:"trash",index:4}])),M||(M=i("details")),l.addListener("newItem",{listener:L,callback:g}),l.addListener("upload",{listener:L,callback:h}),e.$on("$stateChangeSuccess",function(){L.selectedItem=void 0}),e.$on("$destroy",function(){l.removeListener("newItem",L),l.removeListener("upload",L)})}angular.module("materialDrive").controller("DriveController",["$scope","$state","$window","$q","$mdDialog","$cacheFactory","$mdMedia","notifier","google","mimeType",e])}(),function(){"use strict";function e(e,t,n,o,r,i,a){function l(){i("sidenav").toggle()}function s(){var e=i("details");e.isOpen()||e.isLockedOpen()?(p.put("visible",!1),e.close()):(p.put("visible",!0),e.open())}function c(e){var t=o.defer();return a.filesList({query:a.query.fullText.concat(" or title contains '%s'").replace("%s",e)}).then(function(e){t.resolve(e.data.items)},t.reject),t.promise}function u(){d.selectedItem&&(d.selectedItem.mimeType===a.mimeType.folder?n.go("drive.folder",{folderId:d.selectedItem.id}):t.open(d.selectedItem.alternateLink))}var d=this,p=r.get("details");d.toggleSidenav=l,d.toggleDetails=s,d.querySearchText=c,d.searchItemSelected=u,d.status=r.get("drive").get("status"),d.breadcrumb=r.get("drive").get("breadcrumb"),e.$on("$stateChangeSuccess",function(){d.status.search=!1,d.searchText=""})}angular.module("materialDrive").controller("NavbarController",["$scope","$window","$state","$q","$cacheFactory","$mdSidenav","google",e])}(),function(){"use strict";function e(e,t){function n(e){o.selectedMenu||(o.selectedMenu=o.menuList.filter(function(e){return e.selected})[0]),o.selectedMenu.selected=!1,e.selected=!0,o.selectedMenu=e}var o=this,r=e.get("sidenav");o.onMenuSelect=n,o.menuList=r.get("menuList"),o.user=r.get("userInfo"),t.about().success(function(e){o.user=e.user,r.put("userInfo",e.user)})}angular.module("materialDrive").controller("SidenavController",["$cacheFactory","google",e])}(),function(){"use strict";function e(e,t,n){var o=this;o.isExpanded=!1,o.menuList=[{name:"Document",icon:{name:"fa fa-file-word-o fa-lg",bg:"file-word-bg"},mimeType:t.mimeType.document},{name:"Spreadsheet",icon:{name:"fa fa-file-excel-o fa-lg",bg:"file-spreadsheet-bg"},mimeType:t.mimeType.spreadsheet},{name:"Presentation",icon:{name:"fa fa-file-powerpoint-o fa-lg",bg:"file-presentation-bg"},mimeType:t.mimeType.presentation},{name:"Folder",icon:{name:"fa fa-folder fa-lg",bg:"file-bg"},mimeType:t.mimeType.folder}],o.onFileSelected=function(e){e.length&&n.notify("upload",{fileList:e})},o.menuClick=function(t,r){var i=o.menuList[r];e.show({controller:"NameDialogController",controllerAs:"vm",templateUrl:"app/dialog/name-dialog.tpl.html",bindToController:!0,clickOutsideToClose:!0,targetEvent:t,locals:{item:i},onComplete:function(e,t){t.find("input").focus()}}).then(function(e){n.notify("newItem",{name:e,mimeType:i.mimeType})})}}angular.module("materialDrive").controller("NewItemFabController",["$mdDialog","google","notifier",e])}(),function(){"use strict";function e(){return{restrict:"EA",scope:{item:"=mtdDetailsItem"},templateUrl:"app/drive/details.tpl.html",controller:["$scope","$mdSidenav","$mdMedia","$cacheFactory",function(e,t,n,o){n("gt-md")&&o.get("details").get("visible")?t("details").open():t("details").close()}],controllerAs:"detailsCtrl"}}angular.module("materialDrive").directive("mtdDetails",[e])}(),function(){"use strict";function e(e,t){var n=this;e.ok=function(){t.hide(n.fileName)},e.cancel=function(){t.cancel()}}angular.module("materialDrive").controller("NameDialogController",["$scope","$mdDialog",e])}(),function(){"use strict";function e(e,t){function n(){e.hide(a.currentFolder)}function o(){a.path.length>1&&a.path.pop(),a.currentFolder=a.path[a.path.length-1],i(a.currentFolder.id)}function r(e){a.path.push(e),a.currentFolder=e,i(e.id)}function i(e){t.filesList({query:t.query.folder.replace("%s",e),mimeType:t.mimeType.folder}).success(function(e){a.folderList=e.items})}var a=this;a.currentFolder={title:"My Drive",id:"root",isRoot:!0},a.path=[a.currentFolder],a.selectFolder=n,a.exapnd=r,a.goToParent=o,i(a.currentFolder.id)}angular.module("materialDrive").controller("NavigationDialogController",["$mdDialog","google",e])}(),function(){"use strict";function e(e,t,n,o,r){function i(){l.current.promise&&(o.length=0,l.current.promise.abort()),s>0?e.hide():e.cancel()}function a(){var i=o.pop();l.current={file:i,progress:0};var c=n.getUploadEndpoint({file:i,parents:r.isRoot?"":r}).then(function(e){return{endPoint:e.headers().location,file:i}});c=c.then(function(e){var t=n.uploadFile({endpoint:e.endPoint,file:e.file}).progress(function(e){l.current.progress=Math.min(100,Math.ceil(e.loaded/e.total*100))});return l.current.promise=t,t}),c.then(function(){t.show(t.simple().textContent("To upload "+l.current.file.name+" was Successful!").position("top right").hideDelay(2e3)),s++,o.length>0?a():e.hide()})}var l=this,s=0;l.abort=i,a()}angular.module("materialDrive").controller("UploadProgressDialogController",["$mdDialog","$mdToast","google","fileList","currentFolder",e])}();