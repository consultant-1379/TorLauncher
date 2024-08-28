/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2020
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 *----------------------------------------------------------------------------*/
package pipeline

node("Jenkins_fem33s11_mesos_podj") {

    timestamps {
        try {

            configurePipeline(
                    groupId: "com.ericsson.nms.pres",
                    artifactId: "TorLauncher"
            )
            checkoutPhase useConsolidatedDocker: false, gerritProject: env.GERRIT_PROJECT
            setupPhase()
            unitTestsPhase(
                    compileGoals: ["clean install"],
                    testGoals: [],
                    archiveArtifacts: [
                            "rpm/target/rpm/ERIClauncher_CXP9030204/RPMS/noarch/*.rpm",
                    ]
            )
            qualityGatePhase()

        } finally {
            completePipelinePhase(
                    removeDockerContainers: false,
                    collectDockerLogs: false,
                    deleteWorkspace: true
            )
        }
    }

}

