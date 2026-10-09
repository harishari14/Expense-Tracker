import JSZip from 'jszip';
import { SPRING_BOOT_PROJECT_FILES } from '../data/springBootProjectFiles';

export async function generateAndDownloadProjectZip(
  projectName = 'aetherspend-springboot-render-postgresql'
): Promise<boolean> {
  try {
    const zip = new JSZip();

    // Create root folder in zip
    const rootFolder = zip.folder(projectName) || zip;

    // Add all project files
    for (const file of SPRING_BOOT_PROJECT_FILES) {
      rootFolder.file(file.path, file.content);
    }

    // Add standard .gitignore
    rootFolder.file(
      '.gitignore',
      `target/
!.mvn/wrapper/maven-wrapper.jar
!**/src/main/**/target/
!**/src/test/**/target/

### STS ###
.apt_generated
.classpath
.factorypath
.project
.settings
.springBeans
.sts4-cache

### IntelliJ IDEA ###
.idea
*.iws
*.iml
*.ipr

### NetBeans ###
/nbproject/private/
/nbbuild/
/dist/
/nbdist/
/.nb-gradle/
build/
!**/src/main/**/build/
!**/src/test/**/build/

### Environment & Secrets ###
.env
.env.local
`
    );

    // Add Maven wrapper properties
    const wrapperFolder = rootFolder.folder('.mvn')?.folder('wrapper');
    if (wrapperFolder) {
      wrapperFolder.file(
        'maven-wrapper.properties',
        `distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip
wrapperUrl=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar
`
      );
    }

    // Generate zip content as blob
    const content = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9,
      },
    });

    // Trigger download in browser
    const blobUrl = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${projectName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    return true;
  } catch (error) {
    console.error('Failed to generate project zip:', error);
    return false;
  }
}
