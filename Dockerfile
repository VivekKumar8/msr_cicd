FROM store/softwareag/webmethods-microservicesruntime:10.7

MAINTAINER Vivek

#ENV CP=/packages/wMPackages
ARG FPATH=Demo
ARG WmJDBCAdapter
ARG WmCloudStreamsAnalytics
#ENV WmCloudStreamsAnalytics1 /packages/wMPackages/WmCloudStreamsAnalytics
#ENV WmCloudStreamsAnalytics1=${WmCloudStreamsAnalytics}

#RUN echo "Argument is $FPATH"
RUN echo "Argument is $WmCloudStreamsAnalytics"
RUN echo "Argument is $WmCloudStreamsAnalytics1"

#RUN if [ "$WmCloudStreamsAnalytics" = true ] ; then \
#echo WmCloudStreamsAnalytics is selected*****; \
#WmCloudStreamsAnalytics=WmCloudStreamsAnalytics \
#COPY /packages/wMPackages/${FPATH} /opt/softwareag/IntegrationServer/packages/${FPATH} \
#else \
#echo WmCloudStreamsAnalytics not selected; \
#fi
RUN if [[ -z "$WmCloudStreamsAnalytics" ]] ; then WmCloudStreamsAnalytics=Demo ; else WmCloudStreamsAnalytics=WmCloudStreamsAnalytics ; fi
RUN echo $WmCloudStreamsAnalytics
#RUN if [[ -n "$WmCloudStreamsAnalytics" ]] ; then COPY /packages/wMPackages/${FPATH} /opt/softwareag/IntegrationServer/packages/${FPATH}; else echo WmCloudStreamsAnalytics not selected; fi
#RUN if [[ -z "$WmCloudStreamsAnalytics" ]] ; then COPY /packages/wMPackages/${FPATH} /opt/softwareag/IntegrationServer/packages/${FPATH} ; else echo WmCloudStreamsAnalytics not selected; fi
#COPY /packages/wMPackages/WmCloudStreamsAnalytics /opt/softwareag/IntegrationServer/packages
#ARG WmCloudStreamsAnalytics1
#ARG WmCloudStreamsAnalytics10=/packages/wMPackages/WmCloudStreamsAnalytics ////${SAG_HOME}/
COPY /packages/wMPackages/${WmCloudStreamsAnalytics} /opt/softwareag/IntegrationServer/packages/${WmCloudStreamsAnalytics}
#COPY /packages/wMPackages/${FPATH} /opt/softwareag/IntegrationServer/packages/${FPATH}
COPY /packages/customPackages /opt/softwareag/IntegrationServer/packages
