三方aar module gradle 脚本

【简化流程】一键新增 AAR（推荐）
  一条命令完成：建目录、写 build.gradle / gradle.properties、复制 AAR。
  ./scripts/add_local_repo_aar.sh <path_to.aar> [artifactId] [groupId] [version]
  示例：
  · 最少参数（groupId=com.ruixue.thirdparty, version=1.0.0）：  ./scripts/add_local_repo_aar.sh ~/Downloads/foo-1.2.3.aar
  · 指定 artifactId：  ./scripts/add_local_repo_aar.sh ~/Downloads/foo-sdk-1.2.3.aar foo-sdk
  · 指定 GAV：  ./scripts/add_local_repo_aar.sh ./my.aar mylib com.my.company 2.0.0
  完成后执行：  ./scripts/validate_local_repo.sh  再  ./scripts/publish_local_repo.sh <模块名> 或 both

--- 以下为手动步骤（可选）---

1.复制 qooapp 目录 ，使用aar名称命名目录
粘贴要上传aar进目录中。
每个module目录下只能添加一个aar 文件。

2.修改 gradle.properties 中
注意:
properties 中属性值不能添加''号
检查好属性名字值，避免会覆盖错已有aar库，无法恢复

#项目名称，标识项目的唯一性，如com.company.test
pomGroupId=com.ruixue.test
#组件名称，如 spring-boot-hello-world
pomArtifactId=qooapp
#组件版本，如1.0
pomVersion=1.0.0


3.无需修改 settings.gradle。local_repo 下所有含 build.gradle 的子目录会自动被 include。

4.上传前校验（推荐）：  ./scripts/validate_local_repo.sh
   查看所有模块 GAV：  ./scripts/list_local_repo.sh

5.上传到 Maven 仓库：
   · 阿里云（REPO_*）全部：  ./gradlew publishAllLocalRepo  或  ./scripts/publish_local_repo.sh
   · Nexus（NEXUS_*）全部：  ./gradlew publishAllLocalRepoToNexus  或  ./scripts/publish_local_repo.sh nexus
   · 双仓同时发布：  ./gradlew publishAllLocalRepoBoth  或  ./scripts/publish_local_repo.sh both
   · 指定模块：  ./scripts/publish_local_repo.sh qooapp gdt  或  ./scripts/publish_local_repo.sh nexus qooapp
   · 单模块单仓：  ./gradlew :local_repo:qooapp:publishReleasePublicationToAliRepository

  【快速发布一览】
  想发到哪里               | 一条命令
  ------------------------|----------------------------------------------------------
  全部 → 阿里云           | ./scripts/publish_local_repo.sh
  全部 → Nexus            | ./scripts/publish_local_repo.sh nexus
  全部 → 阿里云 + Nexus   | ./scripts/publish_local_repo.sh both
  只发 qooapp、gdt → 阿里云 | ./scripts/publish_local_repo.sh qooapp gdt
  只发 qooapp → Nexus     | ./scripts/publish_local_repo.sh nexus qooapp

6. 在项目中添加三方 aar 引用
api 'com.ruixue.test:qooapp:1.0.0'

7. 在 VENDORS.md 中登记该模块的说明与官方下载/文档链接，便于后续版本追踪与自动化升级。

说明：publish.gradle 已配置双仓库（阿里云 REPO_*、Nexus NEXUS_*），一次构建可分别执行发布到不同目标。CI 中可手动触发 publishLocalRepo（阿里云）或 publishLocalRepoToNexus；本地也可执行 ./tasks.sh local_repo 或 ./tasks.sh local_repo_nexus。

