def WmFlatFileName = ""
def WmJDBCAdapterName = ""
pipeline {
    agent any 

    stages {
        stage('Initialize'){
            steps {
                sh 'chmod -R 777 ${WORKSPACE}'
            }
        }
		stage('Build'){
            steps {
		    //echo " The environment is ${params.WmFlatFile}"
		    script {
   			 if (params.WmFlatFile == false) {
       			// echo " The environment inside script is ${params.WmCloudStreamsAnalytics}"
				 echo "/packages/wMPackages/WmFlatFile" > .dockerignore
			// WmFlatFileName="WmFlatFile" 
    			   }
		    	if (params.WmJDBCAdapter == true) {
       			// echo " The environment inside script is ${params.WmJDBCAdapter}"
			 WmJDBCAdapterName="WmJDBCAdapter" 
    			   }
			   }
                //sh "${WORKSPACE}/Build.sh ${params.WmJDBCAdapter} ${params.WmCloudStreamsAnalytics}"
		    sh "${WORKSPACE}/Build.sh ${WmJDBCAdapterName} ${WmFlatFileName}"
		//   sh "${WORKSPACE}/Build.sh ${params.WmJDBCAdapter} /packages/wMPackages/WmCloudStreamsAnalytics"
            }
        }
		stage('Deploy'){
            steps {
                sh '${WORKSPACE}/Deploy.sh'
            }
        }
    }
}
