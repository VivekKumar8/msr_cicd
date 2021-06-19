FROM store/softwareag/webmethods-microservicesruntime:10.7

MAINTAINER Vivek

COPY /packages/wMPackages/ /opt/softwareag/IntegrationServer/packages/
COPY /packages/customPackages/ /opt/softwareag/IntegrationServer/packages/
